import { useEffect, useState } from 'react';
import { Button, Flex, message } from 'antd';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store'; // 导入 RootState 类型
import { setCurrentDatabase } from '@/store/databaseSlice';
import { getDatabaseData } from '@/api/database';
import TableCard from '@/components/TableCard';
import CreatTableModal from '@/components/CreatTableModal';
import MockDataGeneratorModal from '@/components/MockDataGeneratorModal';
import UpdateModal from '@/components/UpdateModal';
import RestfulApiModal from '@/components/RestfulApi';
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
export interface updateItemType {
    tableName: string;
    data: any;
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
    const getDatabaseDataFn = async (db: string, metadata?: updateMetadata, callback?: () => void) => {
        // 获取数据库数据
        try {
            const data = await getDatabaseData(db);
            if (data.status === 200) {
                setDatabase(filterData(data.data, metadata));
                callback && callback();
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

    // 删除表数据成功之后更新页面数据
    const deleteItem = (params: { tableName: string; id: string | number }) => {
        let newData: databaseDataType = JSON.parse(JSON.stringify(database));
        let item: tableDataType | undefined = newData.tableList.find(
            (item: tableDataType) => item.name === params.tableName
        );
        if (item) {
            let index = item.data.findIndex((v) => v.id === params.id);
            if (index !== -1) {
                item.data.splice(index, 1);
                setDatabase(newData);
            }
        }
    };
    // 删除表成功之后更新页面数据
    const deleteTable = (tableName: string) => {
        let newData: databaseDataType = JSON.parse(JSON.stringify(database));
        let index = newData.tableList.findIndex((item: tableDataType) => item.name === tableName);
        if (index !== -1) {
            newData.tableList.splice(index, 1);
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
        if (data?.data?.length > 0) {
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
                    message.success('添加成功');
                    getDatabaseDataFn(currentDB, { tableName: currentOpenTable.name, metadata: res2.data }, () => {
                        setIsModalOpen2(false);
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
    const handleCancel2 = () => {
        setIsModalOpen2(false);
    };

    // 更新表数据弹窗相关
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const [currentData, setCurrentData] = useState({
        tableName: '',
        data: {},
    });
    const updateItem = (data: updateItemType) => {
        setCurrentData({
            tableName: data.tableName,
            data: data.data,
        });
        setIsModalOpen3(true);
    };
    const handleOk3 = ({ id, tableName, newData }: { id: string | number; tableName: string; newData: any }) => {
        let data: databaseDataType = JSON.parse(JSON.stringify(database));
        let table = data.tableList.find((item: tableDataType) => item.name === tableName);
        if (table) {
            let index = table.data.findIndex((item) => item.id === id);
            if (index !== -1) {
                table.data[index] = newData;
                setDatabase(data);
                setIsModalOpen3(false);
            }
        }
    };
    const handleCancel3 = () => {
        setIsModalOpen3(false);
    };

    //  restfulApi弹窗相关
    const [restfulApiIsOpen, setRestfulApiOpen] = useState(false);
    const [currentApi, setCurrentApi] = useState({
        tableName: '',
        dbName: '',
    });
    const restfulApiOpen = (tableName: string) => {
        setCurrentApi({
            tableName,
            dbName: currentDB,
        });
        setRestfulApiOpen(true);
    };
    const restfulApiClose = () => {
        setRestfulApiOpen(false);
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
                deleteTable={deleteTable}
                updateItem={updateItem}
                showRestfulApi={restfulApiOpen}
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
            <UpdateModal
                open={isModalOpen3}
                onOk={handleOk3}
                onCancel={handleCancel3}
                currentDB={currentDB}
                data={currentData}
            ></UpdateModal>
            <RestfulApiModal
                open={restfulApiIsOpen}
                onClose={restfulApiClose}
                currentApi={currentApi}
            ></RestfulApiModal>
        </>
    );
}
