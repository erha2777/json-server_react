import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import CreateDB from './routes/CreateDB';
import Database from './routes/Database';
import NotFound from './routes/NotFound';
import AppMenu from './components/AppMenu';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Layout, theme } from 'antd';

const { Header, Sider, Content } = Layout;
import './App.scss';

const layoutStyle = {
    overflow: 'hidden',
    width: '100vw',
    height: '100vh',
};
// 扩展 MenuItem 类型，添加路由跳转属性



function App() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();


    return (
        <Layout style={layoutStyle}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical">
                    mock
                </div>
                <AppMenu></AppMenu>
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
                    {/* 路由配置 */}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/createdb" element={<CreateDB />} />
                        <Route path="/database" element={<Database />} />
                        <Route path="*" element={<NotFound />} /> {/* 404 页面 */}
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default App;
