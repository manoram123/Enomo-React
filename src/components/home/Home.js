import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../header/Header';
import './Home.css';
import { Navigate, useNavigate } from 'react-router';
import image from '../../assets/images/image.png';


const Home = () => {

    const navigator = useNavigate();

    // if (localStorage.getItem('token')) {
    //     navigator('/chat');
    // };


    return <div>
        <Header></Header>
        <div className='container mx-auto col-md-10 mt-5'>
            <div className='row'>
                <div className='content-image col-md-4 d-flex align-items-center'>
                    <img className='img img-fluid rounded-circle d-block mx-auto' src={image} alt="" />
                </div>
                <div className='content-text col-md-8 d-flex align-items-center'>
                    <div>
                        <p className='slogan-text align-middle'>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                        <Link to="" className="btn btn-lg btn-success">Get Started</Link>
                    </div>
                </div>
            </div>
        </div>
    </div >;
};

export default Home;
