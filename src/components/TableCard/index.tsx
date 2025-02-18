import { Table, Card } from 'antd';
import type { tableDataType } from '@/routes/Database';
import './index.scss';
export default function TableCard({ data, addData }: { data: tableDataType; addData: (data: tableDataType) => void }) {
    // 获取数据项
    const getColumns = (list: any[]) => {
        if (list && list.length > 0) {
            return list.map((item: any) => {
                return {
                    title: item.alias || item.name,
                    dataIndex: item.name,
                    key: item.name,
                    render: (text: any) => (text ? text : <span style={{ color: 'red' }}>缺失</span>),
                };
            });
        } else {
            return [];
        }
    };

    const addDataFn = () => {
        addData(data);
    };

    return (
        <Card
            title={data.metadata.alias}
            extra={
                <a href="#" onClick={addDataFn}>
                    新增数据
                </a>
            }
            style={{ minWidth: 'calc((100% - 16px * 3) / 4)' }}
        >
            {/* table组件唯一值默认为key字段 */}
            <Table rowKey={(record) => record.id} dataSource={data.data} columns={getColumns(data.metadata.metadata)} />
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
