import React, { useCallback, useEffect } from 'react';
import { Alert, Tag } from 'antd';
import Mock from 'mockjs';
import type { MockDataGeneratorType } from '@/components/MockDataGeneratorModal/index';

type WebMode = 'url' | 'domain' | 'protocol' | 'tld' | 'email' | 'ip';

const WebMock: React.FC<{
    name: string;
    mock: WebMode;
    onChange?: (mock: MockDataGeneratorType) => void;
}> = ({ name, mock, onChange }) => {
    const generatePreview = useCallback(() => {
        let preview = '';
        switch (mock) {
            case 'url':
                preview = Mock.mock('@url');
                break;
            case 'domain':
                preview = Mock.mock('@domain');
                break;
            case 'protocol':
                preview = Mock.mock('@protocol');
                break;
            case 'tld':
                preview = Mock.mock('@tld');
                break;
            case 'email':
                preview = Mock.mock('@email');
                break;
            case 'ip':
                preview = Mock.mock('@ip');
                break;
            default:
                preview = '无效的mock类型';
        }
        return preview;
    }, [mock]);

    const generateRule = useCallback(() => {
        const ruleKey = `${name}`;
        const ruleValue = `@${mock}`;
        return { [ruleKey]: ruleValue };
    }, [name, mock]);

    useEffect(() => {
        const rule = generateRule();
        onChange?.({
            mock: rule || {},
        });
    }, [generateRule]);

    return (
        <div className="web-mock-container" style={{ margin: '16px 0' }}>
            <Alert
                message="操作指南"
                description={mock === 'email' ? '生成随机电子邮件地址' : '生成对应的Web元素'}
                type="info"
                showIcon
            />

            <div style={{ marginTop: 16 }}>
                <Tag color="blue">规则预览</Tag>
                <code>
                    {name} | @{mock}
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

export default WebMock;
