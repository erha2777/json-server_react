import { Table, Card } from 'antd';
import type { tableDataType } from '@/routes/Database';
export default function TableCard({ data }: { data: tableDataType }) {
    // 获取数据项
    const getColumns = (list: any[]) => {
        if (list && list.length > 0) {
            return Object.keys(list[0]).map((key: string) => {
                return {
                    title: key,
                    dataIndex: key,
                    key: key,
                };
            });
        } else {
            return [];
        }
    };

    return (
        <Card title={data.tableName} extra={<a href="#">新增数据</a>} style={{ minWidth: 500 }}>
            {/* table组件唯一值默认为key字段 */}
            <Table rowKey={(record) => record.id} dataSource={data.data} columns={getColumns(data.data)} />
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
