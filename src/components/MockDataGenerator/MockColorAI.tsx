import React, { useState, useCallback, useEffect } from 'react';
import { Select, Alert, Tag, Button, message } from 'antd';
import Mock from 'mockjs';
import type { MockDataGeneratorType } from '@/components/MockDataGeneratorModal/index';

// 定义颜色格式类型
type ColorFormat = '@color' | '@hex' | '@rgb' | '@rgba' | '@hsl';

const MockColor: React.FC<{
    name: string;
    mock: ColorFormat;
    onChange?: (data: MockDataGeneratorType) => void;
}> = ({ name, onChange }) => {
    // 状态管理
    const [colorFormat, setColorFormat] = useState<ColorFormat>('@hex');
    const [colorValue, setColorValue] = useState<string>('');

    // 生成颜色代码
    const generateColor = useCallback(() => {
        try {
            switch (colorFormat) {
                case '@color':
                    return Mock.Random.color();
                case '@hex':
                    return Mock.Random.hex();
                case '@rgb':
                    return Mock.Random.rgb();
                case '@rgba':
                    return Mock.Random.rgba();
                case '@hsl':
                    return Mock.Random.hsl();
                default:
                    return '';
            }
        } catch (error) {
            message.error('生成颜色失败，请检查参数是否正确');
            return '';
        }
    }, [colorFormat]);

    // 处理颜色格式变化
    const handleColorFormatChange = (format: ColorFormat) => {
        setColorFormat(format);
    };

    // 生成规则
    const generateRule = useCallback(() => {
        const color = generateColor();
        if (!color) return;
        return {
            [`${name}`]: colorFormat,
        };
    }, [name, colorFormat, generateColor]);

    // 监听变化，触发回调
    useEffect(() => {
        const color = generateColor();
        setColorValue(color);
        const rule = generateRule();
        onChange?.({
            mock: rule || {},
        });
    }, [generateColor, generateRule, onChange]);

    return (
        <div className="mock-color-container" style={{ margin: '16px 0' }}>
            <Alert message="操作指南" description="选择颜色格式，生成相应的随机颜色代码" type="info" showIcon />

            <div style={{ marginTop: 16 }}>
                <Select
                    value={colorFormat}
                    onChange={handleColorFormatChange}
                    options={[
                        { value: '@color', label: '颜色名称' },
                        { value: '@hex', label: '十六进制颜色' },
                        { value: '@rgb', label: 'RGB 格式' },
                        { value: '@rgba', label: 'RGBA 格式' },
                        { value: '@hsl', label: 'HSL 格式' },
                    ]}
                />
            </div>

            <div style={{ marginTop: 16 }}>
                <Tag color="blue">规则预览</Tag>
                <code>
                    {name} : {colorFormat} = "{colorValue || '<空>'}"
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
                    {colorValue ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    backgroundColor: colorValue,
                                    borderRadius: 4,
                                }}
                            />
                            <span>{colorValue}</span>
                            <Button
                                type="link"
                                onClick={() => {
                                    navigator.clipboard.writeText(colorValue);
                                    message.success('颜色代码已复制到剪贴板');
                                }}
                            >
                                复制
                            </Button>
                        </div>
                    ) : (
                        '选择颜色格式后预览'
                    )}
                </div>
            </div>
        </div>
    );
};

export default MockColor;
