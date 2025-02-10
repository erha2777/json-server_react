import { useEffect, useState } from 'react';
import { Button, Flex } from 'antd';
import { useLocation } from 'react-router-dom';
import { getDatabaseData } from '@/api/database';
import TableCard from '@/components/TableCard';
import CreatTableModal from '@/components/CreatTableModal';
export interface tableDataType {
    tableName: string;
    data: any[];
}
interface databaseDataType {
    databaseName: string;
    tableList: tableDataType[];
}
export default function Database() {
    // 路由相关
    const location = useLocation();
    const [currentDB, setCurrentDB] = useState<string>('');
    const setCurrentDBFn = (name: string) => {
        setCurrentDB(name);
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
                    tableName: key,
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

    // 根据当前路径计算需要展开的父菜单
    useEffect(() => {
        // 解析查询参数
        const queryParams = new URLSearchParams(location.search);
        const name = queryParams.get('name'); // 获取 name 参数的值
        if (name) {
            setCurrentDBFn(name);
            getDatabaseDataFn(name);
        }
    }, [location]);

    // 数据库里面的表列表
    const tableList =
        database.tableList &&
        database.tableList.map((table, index) => <TableCard key={index} data={table}></TableCard>);
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
        </>
    );
}
