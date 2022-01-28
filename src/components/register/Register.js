import axios from 'axios';
import React from 'react'
import Header from '../header/Header';
import './Register.css'
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import AOS from 'aos';
import 'aos/dist/aos.css';

import $ from 'jquery';



const Register = () => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();


    const register = (e) => {
        e.preventDefault();

        axios.post('/user/signup', { email, username, password }).then(function (result) {
            console.log(result.data.type);
            console.log(result.data.message);
            if (result.data.type === 'success') {
                toast.success(result.data.message, { position: toast.POSITION.TOP_RIGHT });
                $('#register-form')[0].reset();
            }
            else if (result.data.type === 'error') {
                toast.error(result.data.message, { position: toast.POSITION.TOP_RIGHT });
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    return (
        <>
            <Header></Header>
            <div className="col-md-8 px-3 mx-auto row">
                <div className='login-card mt-5 pt-5 col-md-6 mx-auto'>
                    <div className="py-2 px-4 mx-auto" data-aos='fade-up' data-aos-duration="1000">
                        <p className='m-0 fw-bold text-center text-login'>Create Account</p>
                        <form id='register-form' onSubmit={register} className='col-10 mx-auto mt-4' >

                            <label htmlFor="" className='my-3 label-text'>E-mail</label>
                            <div className='input-div mb-2 d-flex px-1'>
                                <i className='fas fa-envelope me-3'></i>
                                <input onChange={e => setEmail(e.target.value)} className='text-input w-100' type="text" placeholder='Type your email' />
                            </div>

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

                            <button className='py-2 mt-4 text-light rounded-pill w-100 login-btn' type='submit'>Create Account</button>

                            <div className='d-flex mt-3'>
                                <hr className='container' />
                                <small className='mt-1 mx-2'><small>Or</small></small>
                                <hr className='container' />
                            </div>

                            <a className='nav-link text-muted mx-0 p-0 my-2 d-block text-center text-primary' href="/login">Login</a>

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register
