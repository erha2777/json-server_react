import { Table, Card } from 'antd';
import type { tableDataType } from '@/routes/Database';
import './index.scss';
export default function TableCard({ data, addData }: { data: tableDataType; addData: () => void }) {
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
        <Card
            title={data.metadata.alias}
            extra={
                <a href="#" onClick={addData}>
                    新增数据
                </a>
            }
            style={{ minWidth: 'calc((100% - 16px * 3) / 4)' }}
        >
            {/* table组件唯一值默认为key字段 */}
            <Table rowKey={(record) => record.id} dataSource={data.data} columns={getColumns(data.data)} />
            {/* <Table
                    dataSource={dataSource.map((v, i) => {
                        v.key = i;
                        return v;
                    })}
                    columns={getColumns(dataSource)}
                /> */}
            {data.metadata.description && <div className="desc">{data.metadata.description}</div>}
        </Card>
    );
}
