import Link from 'next/link'
import React, { useEffect } from 'react'
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import { IconButton } from '@mui/material';

const Navbar = () => {
    useEffect(() => {
        if(localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }, [])
    return (
        <div className="header">
            <div className="header-left">
                <Link href="/">
                    <div className='menu-item active'>CSV</div>
                </Link>
            </div>
            <div className='flex flex-1 justify-end items-center'>
                <Link href='/' ><div className="menu-item active cursor-pointer">Home</div></Link>
                <Link href='/new' className="menu-item">
                    <button className="button">
                        <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" viewBox="0 0 512.06 512.06">
                            <path d="M426.63 188.22C402.97 93.95 307.37 36.7 213.08 60.37A176 176 0 0080.39 218.3a96 96 0 0016 190.72h80v-32h-80a64 64 0 010-128 16 16 0 0016-16c-.08-79.53 64.33-144.06 143.86-144.14a144 144 0 01141.42 116.14 16 16 0 0013.6 12.8 80 80 0 01-10.88 159.2h-64v32h64c61.86-.18 111.85-50.48 111.66-112.34a112 112 0 00-85.41-108.46z" />
                            <path d="M245.03 253.66l-64 64 22.56 22.56 36.8-36.64v153.44h32V303.58l36.64 36.64 22.56-22.56-64-64a16 16 0 00-22.55 0z" /></svg>
                        New
                    </button>
                </Link>
                <IconButton className='text-white hover:text-black bg-black hover:bg-white m-3' onClick={() => {
                    document.body.classList.toggle('dark-mode')
                    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light'
                    localStorage.setItem('theme', theme)
                }}>
                    <WbSunnyIcon className='cursor-pointer' />
                </IconButton>
            </div>
        </div>
    )
}

export default Navbar