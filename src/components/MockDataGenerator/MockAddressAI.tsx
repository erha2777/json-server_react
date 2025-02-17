import React, { useCallback, useEffect } from 'react';
import { Alert, Tag } from 'antd';
import Mock from 'mockjs';

type AddressMode = 'region' | 'province' | 'city' | 'county';

const AddressMock: React.FC<{
    name: string;
    mock: AddressMode;
    onChange?: (mock: Record<string, any>) => void;
}> = ({ name, mock, onChange }) => {
    const generatePreview = useCallback(() => {
        let preview = '';
        switch (mock) {
            case 'region':
                preview = Mock.mock('@region');
                break;
            case 'province':
                preview = Mock.mock('@province');
                break;
            case 'city':
                preview = Mock.mock('@city');
                break;
            case 'county':
                preview = Mock.mock('@county');
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
        onChange?.(rule || {});
    }, [generateRule]);

    return (
        <div className="address-mock-container" style={{ margin: '16px 0' }}>
            <Alert
                message="操作指南"
                description={
                    mock === 'region'
                        ? '生成随机区域'
                        : mock === 'province'
                        ? '生成随机省份'
                        : mock === 'city'
                        ? '生成随机都市'
                        : mock === 'county'
                        ? '生成随机县'
                        : '无效的mock类型'
                }
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

export default AddressMock;
