import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createDatabase as addDatabase } from '@/store/databaseSlice';
import { createDatabase } from '@/api/database';
import type { FormProps } from 'antd';
type FieldType = {
    name?: string;
    alias?: string;
};

export default function CreateDB() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('Success:', values);
        if (values.name) {
            try {
                const data = await createDatabase({
                    dbName: values.name,
                    alias: values.alias,
                });
                if (data.status === 200) {
                    dispatch(
                        addDatabase({
                            key: `/database?name=${values.name}`,
                            label: values.alias || values.name,
                        })
                    );
                    navigate(`/database?name=${values.name}`);
                }
            } catch (error) {
                console.error(error);
            }
        }
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
                <Form.Item<FieldType> label="名称" name="name" rules={[{ required: true, message: '请输入名称!' }]}>
                    <Input />
                </Form.Item>

                <Form.Item<FieldType> label="别名" name="alias">
                    <Input />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        创建
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
