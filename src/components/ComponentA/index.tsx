import { useState } from 'react';
import './index.scss';
import { Button } from 'antd';
export default function ComponentA() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className="a">124</div>
            <Button type="primary">Primary Button</Button>
        </>
    );
}
