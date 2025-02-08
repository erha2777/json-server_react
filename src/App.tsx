import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './routes/Home';
import CreateDB from './routes/CreateDB';
import Database from './routes/Database';
import NotFound from './routes/NotFound';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    AppstoreAddOutlined,
    AppstoreOutlined,
    HddOutlined,
    HomeOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;
import './App.scss';

const layoutStyle = {
    overflow: 'hidden',
    width: '100vw',
    height: '100vh',
};
// 扩展 MenuItem 类型，添加路由跳转属性

type MenuItem = Required<MenuProps>['items'][number];
const menuList: MenuItem[] = [
    {
        key: '/',
        icon: <HomeOutlined />,
        label: '首页',
    },
    {
        key: '/createdb',
        icon: <AppstoreAddOutlined />,
        label: '创建数据库',
    },
    {
        key: '/database',
        icon: <AppstoreOutlined />,
        label: '数据库',
        children: [
            {
                key: '/database?name=1',
                icon: <HddOutlined />,
                label: '数据库1',
            },
            {
                key: '/database?name=2',
                icon: <HddOutlined />,
                label: '数据库2',
            },
        ],
    },
]

function App() {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuClick = (item:any) => {
        console.debug(item);
        
        navigate(item.key)
    }
    return (
        <Layout style={layoutStyle}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['2']}
                    onClick={menuClick}
                    items={menuList}
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
