import React from 'react';
import { Drawer, Divider } from 'antd';
import './index.scss';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    currentApi: {
        tableName: string;
        dbName: string;
    };
}
const RestfulApi: React.FC<ModalProps> = ({ open, onClose, currentApi }) => {
    return (
        <>
            <Drawer className="restful-api" title="Restful Api" onClose={onClose} open={open} width={400}>
                <div className="restful-api-title">路由</div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        获取{currentApi.dbName}数据库{currentApi.tableName}表的所有数据。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        获取{currentApi.dbName}数据库{currentApi.tableName}表中指定id的数据。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}/:id?db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        往{currentApi.dbName}数据库{currentApi.tableName}表中添加一条数据。
                    </div>
                    <a href='#'>POST {`/${currentApi.tableName}?db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        修改{currentApi.dbName}数据库{currentApi.tableName}表中指定id的数据（替换修改）。
                    </div>
                    <a href='#'>PUT {`/${currentApi.tableName}/:id?db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        修改{currentApi.dbName}数据库{currentApi.tableName}表中指定id的数据（局部修改）。
                    </div>
                    <a href='#'>PATCH {`/${currentApi.tableName}/:id?db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        删除{currentApi.dbName}数据库{currentApi.tableName}表中指定id的数据。
                    </div>
                    <a href='#'>DELETE {`/${currentApi.tableName}/:id?db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-title">参数</div>
                <div className="restful-api-desc">条件</div>
                <div className="restful-api-item">
                    <ul>
                        <li>{'→=='}</li>
                        <li>{'lt→<'}</li>
                        <li>{'lte→<='}</li>
                        <li>{'gt→>'}</li>
                        <li>{'gte→>='}</li>
                        <li>{'ne→!='}</li>
                    </ul>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中 views 字段值大于 9000 的记录。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?views_gt=9000&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-desc">切片</div>
                <div className="restful-api-item">
                    <ul>
                        <li>{'start'}</li>
                        <li>{'end'}</li>
                        <li>{'limit'}</li>
                    </ul>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中从索引 10 到索引 20 的数据（包含索引 10
                        和 20 的数据）。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?_start=10&_end=20&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中从索引 10 开始的 10 条数据。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?_start=10&_limit=10&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-desc">分页</div>
                <div className="restful-api-item">
                    <ul>
                        <li>{'page'}</li>
                        <li>{'per_page（默认值 = 10）'}</li>
                    </ul>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中第 1 页的 25 条数据。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?_page=1&_per_page=25&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-desc">排序</div>
                <div className="restful-api-item">
                    <ul>
                        <li>{'_sort=f1,f2'}</li>
                    </ul>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中按照 id 升序排列，然后再按照 views
                        降序排列的数据。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?_sort=id,-views&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-desc">嵌套和数组字段</div>
                <div className="restful-api-item">
                    <ul>
                        <li>{'x.y.z...'}</li>
                        <li>{'x.y.z[i]...'}</li>
                    </ul>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中按照 id 升序排列，然后再按照 views
                        降序排列的数据。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?_sort=id,-views&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中所有满足a对象的b字段等于bar的记录。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?a.b=bar&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中 x 对象的 y 字段值小于 100 的记录。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?x.y_lt=100&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中 arr 数组第一个元素等于 bar 的记录。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?arr[0]=bar&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-desc">嵌入</div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中的数据，并将 comments
                        资源嵌入到每个的响应中。（_embed 表示嵌入关联资源。 comments
                        是要嵌入的资源名称。通过id关联，比如posts和comments表，comment数据里面有个postId等于post表数据的id）
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?_embed=comments&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        返回{currentApi.dbName}数据库{currentApi.tableName}表中资源的数据，并将每个数据对应的 post 资源嵌入到响应中。
                    </div>
                    <a href='#'>GET {`/${currentApi.tableName}?_embed=post&db=${currentApi.dbName}`}</a>
                </div>
                <div className="restful-api-title">删除</div>
                <div className="restful-api-item">
                    <div className="restful-api-item-title">
                        删除{currentApi.dbName}数据库{currentApi.tableName}表中id为1及其所有相关的数据。（_dependent
                        是一个自定义的查询参数，用于指定需要删除的依赖资源。 comments 表示要删除与 posts/1
                        相关联的评论。）
                    </div>
                    <a href='#'>DELETE {`/${currentApi.tableName}/1?_dependent=comments&db=${currentApi.dbName}`}</a>
                </div>
            </Drawer>
        </>
    );
};

export default RestfulApi;
