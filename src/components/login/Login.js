import axios from 'axios';
import React, { useEffect } from 'react'
import Header from '../header/Header';
import './Login.css'
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import AOS from 'aos';
import 'aos/dist/aos.css';


const Login = () => {
    if (localStorage.getItem('token')) {
        window.location.href = '/'
    }

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');



    const login = (e) => {
        e.preventDefault();
        axios.post('/user/login', { username, password }).then(function (result) {
            console.log(result)
            if (result.data.type === 'success') {
                console.log(result.data);
                toast.success(result.data.message, { position: toast.POSITION.TOP_RIGHT });
                localStorage.setItem('token', result.data.token);
                window.location.href = '/chat'
            }
            else {
                toast.error(result.data.message, { position: toast.POSITION.TOP_RIGHT });
            }
        })
    }

    return (
        <>
            <Header></Header>
            <div className="col-md-8 px-3 mx-auto row">
                <div className='login-card mt-5 pt-5 col-md-6 mx-auto'>
                    <div className="py-2 px-4 mx-auto" data-aos='fade-up' data-aos-duration="1000">
                        <p className='m-0 fw-bold text-center text-login'>Login</p>
                        <form onSubmit={login} className='col-10 mx-auto' >

                            <label htmlFor="" className='my-3 label-text'>Username</label>
                            <div className='input-div mb-2 d-flex px-1'>
                                <i className='fas fa-user me-3'></i>
                                <input onChange={e => setUsername(e.target.value)} className='text-input w-100' type="text" placeholder='Type your username' />
                            </div>


                            <label htmlFor="" className='my-3 label-text'>Password</label>
                            <div className='input-div mb-1 d-flex px-1'>
                                <i className='fas fa-lock me-3'></i>
                                <input onChange={e => setPassword(e.target.value)} className='text-input w-100' type="password" placeholder='Type your password' />
                            </div>
                            <small className='m-0 ms-auto d-block text-end'><a href="" className='nav-link p-0'><small>Forgot Password?</small></a></small>
                            <button className='py-2 mt-4 text-light rounded-pill w-100 login-btn' type='submit'>Login</button>

                            <div className='d-flex mt-3'>
                                <hr className='container' />
                                <small className='mt-1 mx-2'><small>Or</small></small>
                                <hr className='container' />
                            </div>

                            <a className='nav-link text-muted mx-0 p-0 my-2 d-block text-center text-primary' href="/register">Create an account</a>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login
