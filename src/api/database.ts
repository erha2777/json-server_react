import request from '@/utils/request';

export function getDatabaseData(db: string) {
    return request({
        method: 'get',
        url: `/db?db=${db}`
    })
};


export function getDatabaseList() {
    return request({
        method: 'get',
        url: `/databases`
    })
};

export function createDatabase(data: { dbName: string, alias?: string, initialData?: any }) {
    return request({
        method: 'post',
        url: `/createDatabase`,
        data: {
            dbName: data.dbName,
            alias: data.alias || data.dbName,
            initialData: data.initialData || {}
        }
    })
};

export function createTable(data: { db: string, tableName: string, data?: any[], metadata?: any }) {
    return request({
        method: 'post',
        url: `/addTable?db=${data.db}`,
        data: {
            tableName: data.tableName,
            data: data.data || [],
            metadata: data.metadata || {},
        }
    })
};