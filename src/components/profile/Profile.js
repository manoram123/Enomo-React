import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import '../styles/Chat.css'
import { addScript } from '../../utilities/addscript';
import { toast } from 'react-toastify';
import $ from 'jquery'


const Profile = (props) => {
    addScript('http://localhost:3000/assets/scripts/script.js');


    const userId = useParams().userId;
    const token = localStorage.getItem('token');
    const [user, setUser] = useState('');

    useEffect(() => {
        axios.get(`/user/${userId}`).then(function (result) {
            console.log(result.data.data);
            setUser(result.data.data)
        });
    }, []);

    const uploadImage = (e) => {
        let file = e.target.files[0];
        const data = new FormData();
        data.append("image", file)
        axios.post("/user/upload-image", data).then(function (result) {
            if (result.data.type === 'success') {
                console.log(result.data);
                localStorage.setItem('token', token);
                window.location.href = `/profile/${userId}`
                toast.success(result.data.message, { position: toast.POSITION.TOP_RIGHT });
            }
            else {
                toast.error(result.data.message, { position: toast.POSITION.TOP_RIGHT });
            }
        })
    }


    return <div>
        <div className="container col-md-6 mx-auto pt-4 profile-page px-5">
            <div>
                <h5>Profile</h5>
                <div className="profile-card rounded px-3 py-3">
                    <div className='profile-section-image d-flex'>
                        <div className="d-flex">
                            {
                                user.image ?
                                    <>
                                        <div className='d-flex profile-picture-div'>
                                            <img src={user.image} className='rounded img-fluid' style={{ height: "8ch", width: "8ch", objectFit: "cover" }} alt="" />
                                            <div className='rounded-circle online-tag'></div>
                                        </div>
                                    </> :
                                    <>
                                        <div className='box rounded profile-picture-div profile-image-lg rounded d-flex align-items-center'>
                                            <p className='m-0 mx-auto fw-bold text-light' style={{ fontSize: "2em" }}>{user.username?.charAt(0).toUpperCase()}</p>
                                        </div>
                                    </>
                            }

                            <div className='d-flex align-items-center mx-2'>
                                <div>
                                    <p className='m-0 fw-bold'>{user.username}</p>
                                    <p className='m-0'>{user.firstName} {user.lastName}</p>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex align-items-end p-0 px-2 ms-auto'>
                            <form>
                                <input id='profile-image-input' hidden accept='.png' type="file" name='file' onChange={((e) => uploadImage(e))} />
                            </form>
                            <button onClick={() => { document.getElementById('profile-image-input').click() }} className='edit-btn'><small><i className='fas fa-edit me-1'></i>Edit Image</small></button>
                        </div>
                    </div>
                    <div className='profile-section-info rounded mt-4 py-2 px-4'>
                        <div className='my-3'>
                            <small className='m-0 fw-bold d-block'>Username</small>
                            <div className='d-flex'>
                                <small className='m-0'>{user.username}</small>
                                <div className='ms-auto'>
                                    <button className='edit-btn rounded'>Edit</button>
                                </div>
                            </div>
                        </div>

                        <div className='my-3'>
                            <small className='m-0 fw-bold d-block'>Full Name</small>
                            <div className='d-flex'>
                                <small className='m-0'>{user.firstName} {user.lastName}</small>
                                <div className='ms-auto'>
                                    <button className='edit-btn rounded'>Edit</button>
                                </div>
                            </div>
                        </div>

                        <div className='my-3'>
                            <small className='m-0 fw-bold d-block'>Email</small>
                            <div className='d-flex'>
                                <small className='m-0'>{user.email}</small>
                                <div className='ms-auto'>
                                    <button className='edit-btn rounded'>Edit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};

export default Profile;
