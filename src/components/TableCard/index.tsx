import { Table, Card, Flex, Tooltip, Space, Popconfirm, message } from 'antd';
import type { PopconfirmProps } from 'antd';
import type { tableDataType } from '@/routes/Database';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { deleteTableItem, deleteTable as deleteTableRequest } from '@/api/table';
import './index.scss';
export default function TableCard({
    data,
    addData,
    currentDB,
    deleteItem,
    deleteTable,
}: {
    data: tableDataType;
    addData: (data: tableDataType) => void;
    currentDB: string;
    deleteItem: (params: { tableName: string; id: string | number }) => void;
    deleteTable: (tableName: string) => void;
}) {
    // 获取数据项
    const getColumns = (list: any[]) => {
        if (list && list.length > 0) {
            let arr: any[] = list.map((item: any) => {
                return {
                    title: item.alias || item.name,
                    dataIndex: item.name,
                    key: item.name,
                    render: (text: any) => (text ? text : <span style={{ color: 'red' }}>缺失</span>),
                };
            });
            arr.push({
                title: 'Action',
                dataIndex: 'tabAction',
                key: 'tabAction',
                render: (_: any, record: any) => (
                    <Space size="middle">
                        <Popconfirm
                            title="删除数据"
                            description="确认删除?"
                            onConfirm={() => deleteTableItemFn(record.id)}
                            onCancel={cancel}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            okText="Yes"
                            cancelText="No"
                        >
                            <a style={{ color: 'red' }}>Delete</a>
                        </Popconfirm>
                    </Space>
                ),
            });
            return arr;
        } else {
            return [];
        }
    };

    const addDataFn = () => {
        addData(data);
    };

    const cancel: PopconfirmProps['onCancel'] = () => {
        message.error('取消删除');
    };

    const deleteTableItemFn = async (id: number | string) => {
        try {
            const res = await deleteTableItem({
                tableName: data.name,
                id: id,
                dbName: currentDB,
            });
            if (res.status === 200) {
                message.success('删除成功');
                deleteItem({
                    tableName: data.name,
                    id,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteTableFn = async (tableName: string) => {
        try {
            const res = await deleteTableRequest({
                tableName: data.name,
                dbName: currentDB,
            });
            if (res.status === 200) {
                message.success('删除成功');
                deleteTable(tableName);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Card style={{ minWidth: 'calc((100% - 16px * 3) / 4)' }}>
            <Flex align={'center'} justify={'space-between'} style={{ height: 56 }}>
                <div>
                    <span style={{ fontWeight: 700, marginRight: 10 }}>{data.metadata.alias}</span>
                    <Tooltip title={data.metadata.description}>
                        <InfoCircleOutlined />
                    </Tooltip>
                </div>
                <span>
                    <Popconfirm
                        title="删除表"
                        description="确认删除表，此操作不可逆?"
                        onConfirm={() => deleteTableFn(data.name)}
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a href="#" style={{ color: 'red', marginRight: 10 }}>
                            删除表
                        </a>
                    </Popconfirm>
                    <a href="#" onClick={addDataFn}>
                        新增数据
                    </a>
                </span>
            </Flex>

            {/* table组件唯一值默认为key字段 */}
            <Table rowKey={(record) => record.id} dataSource={data.data} columns={getColumns(data.metadata.metadata)} />
            {/* <Table
                    dataSource={dataSource.map((v, i) => {
                        v.key = i;
                        return v;
                    })}
                    columns={getColumns(dataSource)}
                /> */}
        </Card>
    );
}
