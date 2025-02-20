import React, { useState, useCallback, useEffect } from 'react';
import { Input, Select, Alert, Row, Col, Tag, message } from 'antd';
import Mock from 'mockjs';
import type { MockDataGeneratorType } from '@/components/MockDataGeneratorModal/index';

// 定义图片类型
type ImageType = 'random' | 'data';

// 定义参数类型
interface ImageParams {
    size?: string;
    background?: string;
    foreground?: string;
    format?: string;
    text?: string;
}

const MockImage: React.FC<{
    name: string;
    mock: ImageType;
    onChange?: (data: MockDataGeneratorType) => void;
    defaultValue?: { type: ImageType; params: ImageParams };
}> = ({ name, onChange, defaultValue }) => {
    // 状态管理
    const [imageType, setImageType] = useState<ImageType>(defaultValue?.type || 'random');
    const [params, setParams] = useState<ImageParams>(
        defaultValue?.params || {
            size: '200x200',
            background: '#ffffff',
            foreground: '#000000',
            format: 'png',
            text: 'Random Image',
        }
    );

    // 生成图片地址
    const generateImageURL = useCallback(() => {
        const { size, background, foreground, format, text } = params;
        try {
            if (imageType === 'random') {
                return Mock.Random.image(size, background, foreground, format, text);
            } else {
                return Mock.Random.dataImage(size, text);
            }
        } catch (error) {
            message.error('生成图片失败，请检查参数是否正确');
            return '';
        }
    }, [imageType, params]);

    // 处理参数变化
    const handleParamChange = (field: keyof ImageParams, value: string) => {
        setParams((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // 处理图片类型变化
    const handleImageTypeChange = (type: ImageType) => {
        setImageType(type);
    };

    // 生成规则
    const generateRule = useCallback(() => {
        // const url = generateImageURL();
        // if (!url) return;
        const { size, background, foreground, format, text } = params;
        return {
            [`${name}`]: [imageType, [size, background, foreground, format, text]],
        };
    }, [name, imageType, generateImageURL]);

    // 监听变化，触发回调
    useEffect(() => {
        const rule = generateRule();
        onChange?.({
            mock: rule || {},
            defaultValue: {
                type: imageType,
                params,
            },
        });
    }, [generateRule]);

    return (
        <div className="mock-image-container" style={{ margin: '16px 0' }}>
            <Alert
                message="操作指南"
                description="选择图片类型并输入参数，生成相应的图片地址或 data URL"
                type="info"
                showIcon
            />

            <div style={{ marginTop: 16 }}>
                <Select
                    value={imageType}
                    onChange={handleImageTypeChange}
                    options={[
                        { value: 'random', label: '随机图片地址' },
                        { value: 'data', label: 'Data 图片' },
                    ]}
                />
            </div>

            <div style={{ marginTop: 16 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Input
                            value={params.size}
                            onChange={(e) => handleParamChange('size', e.target.value)}
                            placeholder="输入图片大小（如 200x200）"
                            allowClear
                        />
                    </Col>
                    <Col span={12}>
                        <Input
                            value={params.background}
                            onChange={(e) => handleParamChange('background', e.target.value)}
                            placeholder="输入背景颜色（如 #ffffff）"
                            allowClear
                        />
                    </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: 8 }}>
                    <Col span={12}>
                        <Input
                            value={params.foreground}
                            onChange={(e) => handleParamChange('foreground', e.target.value)}
                            placeholder="输入前景颜色（如 #000000）"
                            allowClear
                        />
                    </Col>
                    <Col span={12}>
                        <Input
                            value={params.format}
                            onChange={(e) => handleParamChange('format', e.target.value)}
                            placeholder="输入图片格式（如 png）"
                            allowClear
                        />
                    </Col>
                </Row>

                <Row gutter={16} style={{ marginTop: 8 }}>
                    <Col span={24}>
                        <Input
                            value={params.text}
                            onChange={(e) => handleParamChange('text', e.target.value)}
                            placeholder="输入图片文字（如 Random Image）"
                            allowClear
                        />
                    </Col>
                </Row>
            </div>

            <div style={{ marginTop: 16 }}>
                <Tag color="blue">规则预览</Tag>
                <code>
                    {name} : "{generateImageURL() || '<空>'}"
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
                    {generateImageURL() ? (
                        <img src={generateImageURL()} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                    ) : (
                        '输入参数后预览'
                    )}
                </div>
            </div>
        </div>
    );
};

export default MockImage;
