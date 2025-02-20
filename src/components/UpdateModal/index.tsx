import React from 'react';
import type { FormProps } from 'antd';
import { Modal, Button, Form, Input, message } from 'antd';
import { updateTableItem } from '@/api/table';
import type { updateItemType } from '@/routes/Database';
interface ModalProps {
    open: boolean;
    onCancel: () => void;
    onOk: (newData: any) => void;
    currentDB: string;
    data: updateItemType;
}

const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
const UpdateModal: React.FC<ModalProps> = ({ open, onCancel, onOk, currentDB, data }) => {
    const onFinish: FormProps['onFinish'] = async (values) => {
        console.log('Success:', values);
        // 关联ID必须为数字，或者是全等
        Object.keys(values).forEach(key=> {
            if(key.includes('Id')) {
                values[key] = parseInt(values[key])
            }
        })
        try {
            const res = await updateTableItem({
                id: data.data.id,
                tableName: data.tableName,
                dbName: currentDB,
                data: values,
            });
            console.debug('res', res);
            if (res.status === 200) {
                message.success('修改成功');
                onOk({
                    id: data.data.id,
                    tableName: data.tableName,
                    newData: res.data,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };
    const items = Object.keys(data.data)
        .filter((key) => key !== 'id')
        .map((key) => (
            <Form.Item label={key} name={key} key={key}>
                <Input />
            </Form.Item>
        ));
    return (
        <Modal title="修改数据" open={open} onCancel={onCancel} cancelText="取消" okText="确认" footer={false}>
            <Form
                name="basic"
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                style={{ maxWidth: 600 }}
                initialValues={data.data}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                {items}
                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        确定
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateModal;
