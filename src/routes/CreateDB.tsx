import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { FormProps } from 'antd';
type FieldType = {
    name?: string;
};

export default function CreateDB() {
    const navigate = useNavigate();
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        navigate(`/database?name=${values.name}`);
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType> label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                    <Input />
                </Form.Item>

                {/* <Form.Item<FieldType> label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                    <Input.Password />
                </Form.Item> */}

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        创建
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
