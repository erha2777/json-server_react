import { useEffect, useState } from 'react';
import { Button, Flex } from 'antd';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store'; // 导入 RootState 类型
import { setCurrentDatabase } from '@/store/databaseSlice';
import { getDatabaseData } from '@/api/database';
import TableCard from '@/components/TableCard';
import CreatTableModal from '@/components/CreatTableModal';
import MockDataGeneratorModal from '@/components/MockDataGeneratorModal';
import type { databaseType } from '@/types/database';
import { tableInsertData, updateTableMetadata } from '@/api/table';

export interface tableDataType {
    name: string;
    data: any[];
    metadata: any;
}
interface databaseDataType {
    databaseName: string;
    tableList: tableDataType[];
}
interface updateMetadata {
    tableName: string;
    metadata: any;
}
export default function Database() {
    const dispatch = useDispatch();
    const currentDBData: databaseType = useSelector((state: RootState) => state.database.currentDB);

    // 路由相关
    const location = useLocation();
    const [currentDB, setCurrentDB] = useState<string>('');
    const setCurrentDBFn = (name: string) => {
        setCurrentDB(name);
        dispatch(setCurrentDatabase({ db: name }));
    };

    // 数据库相关
    const [database, setDatabase] = useState<databaseDataType>({
        databaseName: '',
        tableList: [],
    }); // 数据库数据
    const getDatabaseDataFn = async (db: string, metadata?: updateMetadata) => {
        // 获取数据库数据
        try {
            const data = await getDatabaseData(db);
            if (data.status === 200) {
                setDatabase(filterData(data.data, metadata));
            }
            console.debug('data', data);
        } catch (error) {
            console.error(error);
        }
    };
    const filterData = (data: any, metadata?: updateMetadata) => {
        // 处理数据库数据
        let arr: tableDataType[] = [];
        Object.keys(data).forEach((key: string) => {
            if (Array.isArray(data[key])) {
                if (metadata && metadata.tableName === key) {
                    arr.push({
                        name: key,
                        metadata: metadata.metadata,
                        data: data[key],
                    });
                } else {
                    arr.push({
                        name: key,
                        metadata: (currentDBData.tables && currentDBData.tables[key]) || {},
                        data: data[key],
                    });
                }
            }
        });
        return {
            databaseName: currentDB,
            tableList: arr,
        };
    };

    const deleteItem = (params: { tableName: string; id: string | number }) => {
        // 删除成功之后更新页面数据
        let newData: databaseDataType = JSON.parse(JSON.stringify(database));
        let item: tableDataType | undefined = newData.tableList.find(
            (item: tableDataType) => item.name === params.tableName
        );
        if (item) {
            let index = item.data.findIndex((v) => v.id === params.id);
            item.data.splice(index, 1);
            setDatabase(newData);
        }
    };

    // 创建表弹窗相关
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        getDatabaseDataFn(currentDB);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // mock生成器弹窗
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [currentOpenTable, setCurrentOpenTable] = useState<tableDataType>({
        name: '',
        data: [],
        metadata: {},
    });
    // 显示新增mock数据弹窗
    const showAddMockModal = (data: tableDataType) => {
        setCurrentOpenTable(data);
        setIsModalOpen2(true);
    };
    // 新增mock数据
    const addTableMockData = async (data: any) => {
        try {
            const res1 = await tableInsertData({
                tableName: currentOpenTable.name,
                data: data.data,
                dbName: currentDB,
            });
            const res2 = await updateTableMetadata({
                tableName: currentOpenTable.name,
                metadata: data.mock,
                dbName: currentDB,
            });
            if (res1.status === 201 && res2.status === 200) {
                getDatabaseDataFn(currentDB, { tableName: currentOpenTable.name, metadata: res2.data });
                setIsModalOpen2(false);
            }
        } catch (error) {
            console.error(error);
        }
    };
    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };

    // 根据当前路径计算需要展开的父菜单
    useEffect(() => {
        // 解析查询参数
        const queryParams = new URLSearchParams(location.search);
        const name = queryParams.get('name'); // 获取 name 参数的值
        if (name) {
            setCurrentDBFn(name);
        }
    }, [location]);

    useEffect(() => {
        // 解析查询参数
        const queryParams = new URLSearchParams(location.search);
        const name = queryParams.get('name'); // 获取 name 参数的值
        if (name) {
            getDatabaseDataFn(name);
        }
    }, [currentDBData]);

    // 数据库里面的表列表
    const tableList =
        database.tableList &&
        database.tableList.map((table, index) => (
            <TableCard
                key={index}
                data={table}
                addData={showAddMockModal}
                currentDB={currentDB}
                deleteItem={deleteItem}
            ></TableCard>
        ));
    return (
        <>
            <Flex gap="16px" vertical>
                <Flex justify="flex-end">
                    <Button type="primary" onClick={showModal}>
                        创建表
                    </Button>
                </Flex>

                <Flex gap="16px" wrap align="start">
                    {tableList}
                </Flex>
            </Flex>
            <CreatTableModal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                currentDB={currentDB}
            ></CreatTableModal>
            <MockDataGeneratorModal
                open={isModalOpen2}
                onOk={addTableMockData}
                onCancel={handleCancel2}
                defaultFields={currentOpenTable?.metadata?.metadata || []}
            ></MockDataGeneratorModal>
        </>
    );
}
