import request from '@/utils/request';

export function getDatabaseData(db: string) {
    return request({
        method: 'get',
        url: `/db?db=${db}`
    })
};

export function createTable(data: { db: string, tableName: string, data?: any[] }) {
    return request({
        method: 'post',
        url: `/addTable?db=${data.db}`,
        data: {
            tableName: data.tableName,
            data: data.data || []
        }
    })
};