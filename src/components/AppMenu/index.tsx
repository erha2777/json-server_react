import { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { AppstoreAddOutlined, AppstoreOutlined, HddOutlined, HomeOutlined } from '@ant-design/icons';
type MenuItem = Required<MenuProps>['items'][number];

const DatabaseList: MenuItem[] = [
    {
        key: '/database?name=db1',
        icon: <HddOutlined />,
        label: '数据库1',
    },
    {
        key: '/database?name=db2',
        icon: <HddOutlined />,
        label: '数据库2',
    },
];
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
        children: DatabaseList,
    },
];
const AppMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 自动展开父菜单的 keys
    const [openKeys, setOpenKeys] = useState(['/']);

    // 根据当前路径计算需要展开的父菜单
    useEffect(() => {
        setOpenKeys([location.pathname + location.search]);
    }, [location]);

    const menuClick = (item: any) => {
        navigate(item.key);
    };
    return <Menu theme="dark" mode="inline" defaultSelectedKeys={['/']} defaultOpenKeys={['/database']} selectedKeys={openKeys} onClick={menuClick} items={menuList} />;
};

export default AppMenu;
