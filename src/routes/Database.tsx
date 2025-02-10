import { useEffect, useState } from 'react';
import { Card, Button, Flex } from 'antd';
import { useLocation } from 'react-router-dom';
import { getDatabaseData } from '@/api/database';
import TableItem from '@/components/TableItem';
import CreatTableModal from '@/components/CreatTableModal';

export default function Database() {
    // 路由相关
    const location = useLocation();
    const [currentDB, setCurrentDB] = useState<string>('');
    const setCurrentDBFn = (name:string) => {
        setCurrentDB(name)
    }

    // 数据库相关
    const [database, setDatabase] = useState<any>({}); // 数据库数据
    // 获取数据库数据
    const getDatabaseDataFn = async (db: string) => {
        try {
            const data = await getDatabaseData(db);
            if (data.status === 200) {
                setDatabase(data.data);
            }
            console.debug('data', data);
        } catch (error) {
            console.error(error);
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
    const tableList = Object.keys(database).map((tabName, index) =>
        Array.isArray(database[tabName]) ? (
            <Card key={index} title={tabName} extra={<a href="#">More</a>} style={{ minWidth: 500 }}>
                <TableItem dataSource={database[tabName]}></TableItem>
            </Card>
        ) : null
    );
    return (
        <>
            <Flex gap="16px" vertical>
                <Flex justify="flex-end">
                    <Button type="primary" onClick={showModal}>创建表</Button>
                </Flex>

                <Flex gap="16px" wrap align="start">
                    {tableList}
                </Flex>
            </Flex>
            <CreatTableModal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} currentDB={currentDB}></CreatTableModal>
        </>
    );
}
