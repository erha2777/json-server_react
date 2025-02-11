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

export interface tableDataType {
    data: any[];
    metadata: any;
}
interface databaseDataType {
    databaseName: string;
    tableList: tableDataType[];
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
    const getDatabaseDataFn = async (db: string) => {
        // 获取数据库数据
        try {
            const data = await getDatabaseData(db);
            if (data.status === 200) {
                setDatabase(filterData(data.data));
            }
            console.debug('data', data);
        } catch (error) {
            console.error(error);
        }
    };
    const filterData = (data: any) => {
        // 处理数据库数据
        let arr: tableDataType[] = [];
        Object.keys(data).forEach((key: string) => {
            if (Array.isArray(data[key])) {
                arr.push({
                    metadata: (currentDBData.tables && currentDBData.tables[key]) || {},
                    data: data[key],
                });
            }
        });
        return {
            databaseName: currentDB,
            tableList: arr,
        };
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
    const showModal2 = () => {
        setIsModalOpen2(true);
    };
    const handleOk2 = () => {
        setIsModalOpen2(false);
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
    const tableList = database.tableList && database.tableList.map((table, index) => <TableCard key={index} data={table} addData={showModal2}></TableCard>);
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
            <CreatTableModal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} currentDB={currentDB}></CreatTableModal>
            <MockDataGeneratorModal open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2}></MockDataGeneratorModal>
        </>
    );
}
