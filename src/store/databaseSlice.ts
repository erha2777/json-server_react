import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { databaseType } from '@/types/database'
// 定义状态的类型
interface DatabaseState {
    list: any[];
    currentDB: databaseType;
}

// 初始状态
const initialState: DatabaseState = {
    list: [],
    currentDB: {}
};

// 创建 Slice
const databaseSlice = createSlice({
    name: 'database', // Slice 名称
    initialState, // 初始状态
    reducers: {
        // 定义 reducer 和 action
        createDatabase(state, action: PayloadAction<{}>) {// 创建数据库
            state.list = [...state.list, action.payload];
            state.currentDB = action.payload;
        },
        deleteDatabase(state, action: PayloadAction<{ index: number }>) {// 删除数据库
            state.list.splice(action.payload.index, 1);
        },
        setDatabaseList(state, action: PayloadAction<{ list: databaseType[], db?: string }>) { // 设置数据库列表数据
            let list = action.payload.list.map((dbItem: databaseType) => {
                return {
                    name: dbItem.name,
                    key: `/database?name=${dbItem.name}`,
                    label: dbItem.alias || dbItem.name,
                    created_at: dbItem.created_at,
                    updated_at: dbItem.updated_at,
                    tables: dbItem.tables || {},
                }
            })
            state.list = list;
            // 刷新时设置当前数据库
            if (action.payload.db) {
                let db = list.find(v => v.name === action.payload.db);
                if (db) {
                    state.currentDB = db;
                }
            }
        },
        setCurrentDatabase(state, action: PayloadAction<{ db: string }>) {// 设置当前数据库数据
            let db = state.list.find(v => v.name === action.payload.db);
            if (db) {
                state.currentDB = db;
            }
        },
        addTable(state, action: PayloadAction<{ tableName: string, metadata: any }>) { // 新增表数据
            let currentDB = state.list.find((v: any) => v.name === state.currentDB.name);
            currentDB.tables[action.payload.tableName] = action.payload.metadata;
            state.currentDB = currentDB;
        },
    },
});

// 导出 action
export const { createDatabase, deleteDatabase, setDatabaseList, setCurrentDatabase, addTable } = databaseSlice.actions;

// 导出 reducer
export default databaseSlice.reducer;