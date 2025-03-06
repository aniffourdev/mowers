import React from 'react'
import { AiOutlineMenu } from 'react-icons/ai'

const Mobilemenu = () => {
  return (
    <nav className='block lg:hidden'>
      <AiOutlineMenu className='size-5 cursor-pointer' />
    </nav>
  )
}

export default Mobilemenu