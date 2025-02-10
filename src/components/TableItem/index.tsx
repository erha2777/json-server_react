import { Table } from 'antd';
export default function TableItem({ dataSource, tabItemkey }: { dataSource: any[]; tabItemkey: string | number }) {
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
        return <Table key={tabItemkey} dataSource={dataSource} columns={getColumns(dataSource)} />;
    }
    return null;
}
