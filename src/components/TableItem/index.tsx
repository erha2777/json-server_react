import { Table } from 'antd';
export default function TableItem({ dataSource }: { dataSource: any[] }) {
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

    if (dataSource && Array.isArray(dataSource)) {
        // table组件唯一值默认为key字段
        return (
            <Table rowKey={(record) => record.id} dataSource={dataSource} columns={getColumns(dataSource)} />
            // <Table
            //     dataSource={dataSource.map((v, i) => {
            //         v.key = i;
            //         return v;
            //     })}
            //     columns={getColumns(dataSource)}
            // />
        );
    }
    return null;
}
