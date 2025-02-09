import { configureStore } from '@reduxjs/toolkit';
import databaseReducer from './databaseSlice'; // 导入 Slice
// 创建 Store
const store = configureStore({
    reducer: {
        // 这里可以添加多个 reducer
        database: databaseReducer, // 添加 Slice
    },
});

// 导出 Store 的类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;