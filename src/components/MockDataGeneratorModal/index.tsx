import React, { useState } from 'react';
import { Modal, Button, Form, Input, Cascader, Table, Flex, InputNumber } from 'antd';
import type { InputNumberProps } from 'antd';
import options from './enum';
import Mock from 'mockjs';
import MockDataGenerator from '@/components/MockDataGenerator';

// 定义字段类型
interface Field {
    name: string;
    alias: string;
    type: string[];
    mock: any;
}

interface tableData {
    dataSource: any[];
    columns: any[];
}
interface ModalProps {
    open: boolean;
    onCancel: () => void;
    onOk: (data: any) => void;
}

const MockDataGeneratorModal: React.FC<ModalProps> = ({ open, onCancel, onOk }) => {
    const [fields, setFields] = useState<Field[]>([]);
    const [mockData, setMockData] = useState<tableData>({
        dataSource: [],
        columns: [],
    });

    const addField = () => {
        setFields([...fields, { name: '', alias: '', type: [], mock: '' }]);
    };

    // 删除字段
    const removeField = (index: number) => {
        const newFields = [...fields];
        newFields.splice(index, 1);
        setFields(newFields);
    };

    // table组件配置
    const getColumns = (list: Field[]) => {
        return list.map((item) => {
            return {
                title: item.alias || item.name,
                dataIndex: item.name,
                key: item.name,
            };
        });
    };

    const [number, setNumber] = useState(10);

    const onChange: InputNumberProps['onChange'] = (value) => {
        if (typeof value === 'number') {
            setNumber(value);
        }
    };

    // 生成 Mock 数据
    const generateMockData = () => {
        const template: { [key: string]: any } = {};
        fields.forEach((field: any) => {
            Object.keys(field.mock).forEach((key: string) => {
                template[key] = field.mock[key];
            });
        });
        console.debug('template', template);

        const data = Mock.mock({
            [`list|${number}`]: [template], // 生成 10 条数据
        }).list;
        console.debug('data', data);

        setMockData({
            dataSource: data.map((v: any, i: number) => {
                v.id = i;
                return v;
            }),
            columns: getColumns(fields),
        });
    };

    const onOkFn = () => {
        onOk({
            mock: fields,
            data: mockData.dataSource.map((v) => {
                let { id, ...obj } = v;
                return obj;
            }),
        });
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
                                <div>{JSON.stringify(field)}</div>
                                <MockDataGenerator
                                    name={field.name}
                                    mock={field.type}
                                    onChange={(value) => {
                                        const newFields = [...fields];
                                        newFields[index].mock = value;
                                        setFields(newFields);
                                    }}
                                ></MockDataGenerator>
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
                    <Flex align={'center'} justify={'space-between'}>
                        <Flex align={'center'} gap={5}>
                            <InputNumber min={0} max={100} step={5} defaultValue={number} onChange={onChange} />条
                            <Button type="primary" onClick={generateMockData}>
                                生成 Mock 数据
                            </Button>
                        </Flex>
                        <Button type="primary" onClick={onOkFn}>
                            保存
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
            <Table rowKey={(record: any) => record.id} dataSource={mockData.dataSource} columns={mockData.columns} />
        </Modal>
    );
};

export default MockDataGeneratorModal;
