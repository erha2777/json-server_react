import React, { useState, useCallback, useEffect } from 'react';
import { Input, Alert, Row, Tag } from 'antd';
import Mock from 'mockjs';
import type { MockDataGeneratorType } from '@/components/MockDataGeneratorModal/index';

type NameMode = 'cfirst' | 'clast' | 'cname' | 'first' | 'last' | 'name';

const NameMock: React.FC<{
    name: string;
    mock: NameMode;
    onChange?: (data: MockDataGeneratorType) => void;
}> = ({ name, mock, onChange }) => {
    const [state, setState] = useState<{
        middle: boolean;
    }>({
        middle: false,
    });

    const generatePreview = useCallback(() => {
        let preview = '';
        switch (mock) {
            case 'cfirst':
                preview = Mock.mock('@cfirst');
                break;
            case 'clast':
                preview = Mock.mock('@clast');
                break;
            case 'cname':
                preview = Mock.mock('@cname');
                break;
            case 'first':
                preview = Mock.mock('@first');
                break;
            case 'last':
                preview = Mock.mock('@last');
                break;
            case 'name':
                preview = Mock.mock(`@name(${state.middle})`);
                break;
            default:
                preview = '无效的mock类型';
        }
        return preview;
    }, [mock, state.middle]);

    const generateRule = useCallback(() => {
        const ruleKey = `${name}`;
        const ruleValue = mock === 'name' ? `@name(${state.middle})` : `@${mock}`;
        return { [ruleKey]: ruleValue };
    }, [name, mock, state.middle]);

    const handleChange = {
        middle: (checked: boolean) => {
            setState((prev) => ({ ...prev, middle: checked }));
        },
    };

    useEffect(() => {
        const rule = generateRule();
        onChange?.({
            mock: rule || {},
        });
    }, [generateRule]);

    return (
        <div className="name-mock-container" style={{ margin: '16px 0' }}>
            <Alert
                message="操作指南"
                description={mock === 'name' ? '设置是否包含中间名，生成英语姓名' : '生成对应类型的名字'}
                type="info"
                showIcon
            />

            <Row gutter={16} style={{ marginTop: 16 }}>
                {mock === 'name' && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Input
                            checked={state.middle}
                            onChange={(e) => handleChange.middle(e.target.checked)}
                            type="checkbox"
                            placeholder="包含中间名"
                        />
                        <div style={{ whiteSpace: 'nowrap', marginLeft: '5px' }}>包含中间名</div>
                    </div>
                )}
            </Row>

            <div style={{ marginTop: 16 }}>
                <Tag color="blue">规则预览</Tag>
                <code>
                    {name} | {mock === 'name' ? `@${mock}(${state.middle})` : `@${mock}`}
                </code>
            </div>

            <div style={{ marginTop: 8 }}>
                <Tag color="geekblue">示例输出</Tag>
                <div
                    style={{
                        padding: 8,
                        background: '#fafafa',
                        borderRadius: 4,
                        minHeight: 32,
                    }}
                >
                    {generatePreview()}
                </div>
            </div>
        </div>
    );
};

export default NameMock;
