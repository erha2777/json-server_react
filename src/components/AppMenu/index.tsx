import { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setDatabaseList } from '@/store/databaseSlice';
import { getDatabaseList } from '@/api/database';
import { RootState } from '@/store/store'; // 导入 RootState 类型
import type { MenuProps } from 'antd';
// import type { databaseType } from '@/types/database'
import { AppstoreAddOutlined, AppstoreOutlined, HddOutlined, HomeOutlined } from '@ant-design/icons';
type MenuItem = Required<MenuProps>['items'][number];

const menuListData: MenuItem[] = [
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
];
const AppMenu = () => {
    // 获取状态
    const databaseList: any = useSelector((state: RootState) => state.database.list);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    // 菜单列表
    const [menuList, setMenuList] = useState<any[]>([]);

    // 自动展开父菜单的 keys
    const [openKeys, setOpenKeys] = useState(['/']);

    const addMenuItem = (arr: any[]) => {
        // 动态新增菜单项
        setMenuList([
            ...menuListData,
            {
                key: '/database',
                icon: <AppstoreOutlined />,
                label: '数据库',
                children: arr,
            },
        ]);
    };

    // 设置数据库数据
    const setDatabaseListFn = async () => {
        try {
            const data = await getDatabaseList();
            if (data.status === 200) {
                let list = data.data.databases;
                // let list = data.data.databases.filter((item: databaseType) => item.name !== 'default');
                dispatch(setDatabaseList({ list }));
            }
        } catch (error) {
            console.error(error);
        }
    };
    // 获取数据库列表
    useEffect(() => {
        setDatabaseListFn();
    }, []);

    // 根据当前路径计算需要展开的父菜单
    useEffect(() => {
        setOpenKeys([location.pathname + location.search]);
    }, [location]);

    // 数据库列表更新后，去更新菜单列表
    useEffect(() => {
        let arr = databaseList.map((item: any) => {
            return {
                ...item,
                icon: <HddOutlined />,
            };
        });
        addMenuItem(arr);
    }, [databaseList]);

    const menuClick = (item: any) => {
        navigate(item.key);
    };
    return <Menu theme="dark" mode="inline" defaultSelectedKeys={['/']} defaultOpenKeys={['/database']} selectedKeys={openKeys} onClick={menuClick} items={menuList} />;
};

export default AppMenu;
