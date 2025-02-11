import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Home from './routes/Home';
import CreateDB from './routes/CreateDB';
import Database from './routes/Database';
import NotFound from './routes/NotFound';
import AppMenu from './components/AppMenu';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Layout, theme } from 'antd';
import { setDatabaseList } from '@/store/databaseSlice';
import { getDatabaseList } from '@/api/database';

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
    const dispatch = useDispatch();
    const location = useLocation();

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // 设置数据库数据
    const setDatabaseListFn = async (db?: string) => {
        try {
            const data = await getDatabaseList();
            if (data.status === 200) {
                let list = data.data.databases;
                // let list = data.data.databases.filter((item: databaseType) => item.name !== 'default');
                dispatch(setDatabaseList({ list, db }));
            }
        } catch (error) {
            console.error(error);
        }
    };
    // 获取数据库列表
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const name = queryParams.get('name') || ''; // 获取 name 参数的值
        setDatabaseListFn(name);
    }, []);

    return (
        <Layout style={layoutStyle}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical">mock</div>
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
