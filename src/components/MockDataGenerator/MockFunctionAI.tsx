import React, { useState, useEffect } from 'react';
import { Input, Alert, Tag } from 'antd';

const MockFunction: React.FC<{
    name: string;
    mock: 'Function' | 'function'; // 匹配数据结构的value
    onChange?: (value: Record<string, any>) => void;
}> = ({ name, mock, onChange }) => {
    // 状态管理
    const [functionPath, setFunctionPath] = useState('');

    // 生成Mock规则
    const generateRule = () => {
        if (mock === 'function') {
            return { [`${name}|@pick`]: functionPath };
        }
        return {}; // Function父级不需要生成规则
    };

    // 同步规则变化
    useEffect(() => {
        onChange?.(generateRule());
    }, [name, mock, functionPath]);

    return (
        <div className="mock-function">
            {mock === 'Function' ? (
                <Alert message="方法类型说明" description="请选择子项配置具体方法规则" type="info" showIcon />
            ) : (
                <>
                    <Alert message="属性引用规则" description="通过 @pick 函数引用其他属性值" type="info" showIcon />
                    <Input
                        value={functionPath}
                        onChange={(e) => setFunctionPath(e.target.value)}
                        placeholder="输入属性路径（例如：user.list.0.name）"
                        style={{ marginTop: 16 }}
                    />
                    <div style={{ marginTop: 8 }}>
                        生成规则：{name}|@pick <Tag color="blue">{functionPath || '未配置'}</Tag>
                    </div>
                </>
            )}
        </div>
    );
};

export default MockFunction;
