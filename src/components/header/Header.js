import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import Logo from './Logo';
import { logout } from '../../auth/config';

const Header = () => {



    // useEffect(() => {
    //     const user = localStorage.getItem('token');
    //     if (user) {
    //         window.location.href = '/';
    //     }
    // }, []);

    const user = localStorage.getItem('token')


    return <div className='header px-3 pt-2 shadow-sm fixed-top'>
        <div className='container mx-auto d-flex'>
            <Logo></Logo>
            <div className='header-links mt-2 ms-auto d-flex'>
                <div className='mx-3 mt-2'>
                    <Link to="" className='link'>Developers</Link>
                </div>
                <div className='mx-3 mt-2'>
                    <Link to="" className='link'>About</Link>
                </div>
                <div className='mx-3 mt-2'>
                    <Link to="" className='link'>Features</Link>
                </div>


                {
                    user ?
                        <div className='mx-3'>
                            <button onClick={logout} className='link btn'><i className='fas fa-sign-out-alt mx-1'></i>Logout</button>
                        </div>
                        : <>
                            <div className='mx-3 mt-2'>
                                <Link to="/login" className='link'><i className='fas fa-mobile-alt mx-1'></i>Login</Link>
                            </div>
                            <div className=''>
                                <Link to="/register" className='btn btn-outline-primary rounded-pill'>Get Started</Link>
                            </div>
                        </>
                }
            </div>
        </div>

    </div>;
};

export default Header;
