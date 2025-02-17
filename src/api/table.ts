import request from '@/utils/request';

export function tableInsertData(data: { tableName: string, data?: any[], dbName: string }) {
    return request({
        method: 'post',
        url: `/${data.tableName}/batch?db=${data.dbName}`,
        data: data?.data,
    })
};

export function updateTableMetadata(data: { tableName: string, metadata?: any[], dbName: string }) {
    return request({
        method: 'put',
        url: `/updateTableMetadata`,
        data,
    })
};