import React, { useState } from 'react';
import { Modal, Button, Form, Input, Cascader } from 'antd';
import type { CascaderProps } from 'antd';
import options from './enum';
import type { Option } from './enum';
import Mock from 'mockjs';
import MockDataGenerator from '@/components/MockDataGenerator';

// 定义字段类型
interface Field {
    name: string;
    alias: string;
    type: string[];
    mock: string;
}

// 定义生成的 Mock 数据类型
interface MockData {
    [key: string]: any;
}
interface ModalProps {
    open: boolean;
    onCancel: () => void;
    onOk: () => void;
}

const MockDataGeneratorModal: React.FC<ModalProps> = ({ open, onCancel, onOk }) => {
    const [fields, setFields] = useState<Field[]>([]);
    const [mockData, setMockData] = useState<MockData[]>([]);

    const addField = () => {
        setFields([...fields, { name: '', alias: '', type: [], mock: '' }]);
    };

    // 删除字段
    const removeField = (index: number) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    const onChange: CascaderProps<Option>['onChange'] = (value) => {
        console.log(value);
    };

    // 生成 Mock 数据
    const generateMockData = () => {
        const template: { [key: string]: any } = {};
        fields.forEach((field) => {
            switch (field.type) {
                default:
                    template[field.name] = Mock.Random.string(5, 10);
            }
        });
        console.debug('template', template);

        const data = Mock.mock({
            'list|10': [template], // 生成 10 条数据
        }).list;

        setMockData(data);
    };
    return (
        <Modal
            title="Mock 数据生成器"
            open={open}
            onCancel={onCancel}
            cancelText="取消"
            okText="确认"
            footer={false}
            width="80%"
        >
            <Form layout="vertical">
                {fields.map((field, index) => (
                    <Form.Item key={index} label={`字段 ${index + 1}`}>
                        <div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Input
                                    placeholder="字段名称"
                                    value={field.name}
                                    onChange={(e) => {
                                        const newFields = [...fields];
                                        newFields[index].name = e.target.value;
                                        setFields(newFields);
                                    }}
                                />
                                <Input
                                    placeholder="字段别名"
                                    value={field.alias}
                                    onChange={(e) => {
                                        const newFields = [...fields];
                                        newFields[index].alias = e.target.value;
                                        setFields(newFields);
                                    }}
                                />
                                <Cascader
                                    options={options}
                                    onChange={(value) => {
                                        const newFields = [...fields];
                                        newFields[index].type = value;
                                        setFields(newFields);
                                    }}
                                    placeholder="Please select"
                                />

                                <Button danger onClick={() => removeField(index)}>
                                    删除
                                </Button>
                            </div>
                            <div>
                                {/* <div>{JSON.stringify(field.type)}</div> */}
                                <MockDataGenerator name={field.name} mock={field.type}></MockDataGenerator>
                            </div>
                        </div>
                    </Form.Item>
                ))}
                <Form.Item>
                    <Button type="dashed" onClick={addField}>
                        添加字段
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={generateMockData}>
                        生成 Mock 数据
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MockDataGeneratorModal;
