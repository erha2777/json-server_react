import { useState } from 'react'
import './index.scss'

export default function ComponentA() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='a'>
        124
      </div>
    </>
  )
}