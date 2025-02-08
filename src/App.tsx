import { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AppstoreAddOutlined,
    AppstoreOutlined,
    HddOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;
import './App.scss';

const layoutStyle = {
    overflow: 'hidden',
    width: '100vw',
    height: '100vh',
};
function App() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout style={layoutStyle}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['2']}
                    items={[
                        {
                            key: '1',
                            icon: <AppstoreAddOutlined />,
                            label: '创建数据库',
                        },
                        {
                            key: '2',
                            icon: <AppstoreOutlined />,
                            label: '数据库',
                            children:[
                              {
                                key: '2-1',
                                icon: <HddOutlined />,
                                label: '数据库1',
                              },
                              {
                                key: '2-2',
                                icon: <HddOutlined />,
                                label: '数据库2',
                              },
                            ]
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    Content
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;
