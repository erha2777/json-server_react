import { Card, Space } from 'antd';
export default function Database() {
    return (
        <Space size={16} wrap>
            <Card title="数据表1" extra={<a href="#">More</a>} style={{ minWidth: 300 }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
            <Card title="数据表2" extra={<a href="#">More</a>} style={{ minWidth: 300 }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
        </Space>
    );
}
