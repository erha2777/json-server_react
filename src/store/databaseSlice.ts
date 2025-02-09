import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// 定义状态的类型
interface DatabaseState {
    list: any[];
}

// 初始状态
const initialState: DatabaseState = {
    list: [
        {
            key: '/database?name=db1',
            label: '数据库1',
        },
        {
            key: '/database?name=db2',
            label: '数据库2',
        },
    ],
};

// 创建 Slice
const databaseSlice = createSlice({
    name: 'database', // Slice 名称
    initialState, // 初始状态
    reducers: {
        // 定义 reducer 和 action
        createDatabase(state, action: PayloadAction<{ key: string, label: string }>) {
            state.list.push(action.payload)
        },
        deleteDatabase(state, action: PayloadAction<{ index: number }>) {
            state.list.splice(action.payload.index, 1)
        },
    },
});

// 导出 action
export const { createDatabase, deleteDatabase } = databaseSlice.actions;

// 导出 reducer
export default databaseSlice.reducer;