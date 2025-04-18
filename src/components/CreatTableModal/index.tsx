import React from 'react';
import type { FormProps } from 'antd';
import { Modal, Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { createTable } from '@/api/database';
import { addTable } from '@/store/databaseSlice';
interface ModalProps {
    open: boolean;
    onCancel: () => void;
    onOk: () => void;
    currentDB: string;
}
type FieldType = {
    name: string;
    alias?: string;
    description?: string;
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
const CreatTableModal: React.FC<ModalProps> = ({ open, onCancel, onOk, currentDB }) => {
    const dispatch = useDispatch();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (values.name) {
            try {
                let metadata = {
                    alias: values.alias || values.name,
                    description: values.description || '表的简介',
                };
                const data = await createTable({
                    db: currentDB,
                    tableName: values.name,
                    metadata,
                });
                if (data.status === 200) {
                    dispatch(addTable({ tableName: values.name, metadata }));
                    onOk();
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
    return (
        <Modal title="创建表" open={open} onCancel={onCancel} cancelText="取消" okText="确认" footer={false}>
            <Form
                name="basic"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="表名（英文）"
                    name="name"
                    rules={[
                        { required: true, message: '请输入名称!' },
                        {
                            validator: (_, value) => {
                                if (/^[a-zA-Z]+$/.test(value)) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject(new Error('名称只能为英文!'));
                                }
                            },
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="别名" name="alias">
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="简介" name="description">
                    <Input />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        确定
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreatTableModal;
