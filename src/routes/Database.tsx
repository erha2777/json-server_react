import { useEffect, useState } from 'react';
import { Card, Button, Flex } from 'antd';
import { useLocation } from 'react-router-dom';
import { getDatabaseData } from '@/api/database';
import TableItem from '@/components/TableItem';

export default function Database() {
    const location = useLocation();
    const [database, setDatabase] = useState<any>({});
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

    // 根据当前路径计算需要展开的父菜单
    useEffect(() => {
        // 解析查询参数
        const queryParams = new URLSearchParams(location.search);
        const name = queryParams.get('name'); // 获取 name 参数的值
        if (name) {
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
                    <Button type="primary">创建表</Button>
                </Flex>

                <Flex gap="16px" wrap align="start">
                    {tableList}
                </Flex>
            </Flex>
        </>
    );
}
