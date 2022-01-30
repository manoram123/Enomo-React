import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import '../styles/Chat.css'
import { addScript } from '../../utilities/addscript';
import { toast } from 'react-toastify';
import { logout } from '../../auth/config';


const Profile = (props) => {
    addScript('http://localhost:3000/assets/scripts/script.js');


    const userId = useParams().userId;
    const token = localStorage.getItem('token');
    const [user, setUser] = useState('');

    const [username, setUsername] = useState('')
    const [firstName, setFirstname] = useState('')
    const [lastName, setLastname] = useState('')
    const [email, setEmail] = useState('')




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
                // localStorage.setItem('token', token);
                window.location.href = `/profile/${userId}`
                toast.success(result.data.message, { position: toast.POSITION.TOP_RIGHT });
            }
            else {
                toast.error(result.data.message, { position: toast.POSITION.TOP_RIGHT });
            }
        })
    }

    const updateUsername = (username) => {
        axios.post('/update-profile', { field: "username", username: username }).then(function (result) {
            if (result.data.type === 'success') {
                console.log(result.data);
                window.location.href = `/profile/${userId}`
                toast.success(result.data.message, { position: toast.POSITION.TOP_RIGHT });
            }
            else {
                toast.error(result.data.message, { position: toast.POSITION.TOP_RIGHT });
            }
        })
    }

    const updateName = (firstName, lastName) => {
        axios.post('/update-profile', { field: "name", firstName: firstName, lastName: lastName }).then(function (result) {
            if (result.data.type === 'success') {
                window.location.href = `/profile/${userId}`
                toast.success(result.data.message, { position: toast.POSITION.TOP_RIGHT });
            }
            else {
                toast.error(result.data.message, { position: toast.POSITION.TOP_RIGHT });
            }
        })
    }

    const updateEmail = (email) => {
        axios.post('/update-profile', { field: "email", email: email }).then(function (result) {
            if (result.data.type === 'success') {
                console.log(result.data);
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
                <div className='d-flex py-1'>
                    <h5>Profile</h5>
                    <a href='/chat' className='rounded-circle border border-danger ms-auto d-flex align-items-center' style={{ height: '3ch', width: '3ch', textDecoration: 'none' }}><i className='fas fa-times d-block mx-auto text-danger'></i></a>
                </div>
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
                                    <small onClick={logout} className='border border-secondary rounded px-1 logout-btn'><i className='fas fa-sign-out me-1'></i>Logout</small>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex align-items-end p-0 px-2 ms-auto'>
                            <form>
                                <input id='profile-image-input' hidden accept='.png' type="file" name='file' onChange={((e) => uploadImage(e))} />
                            </form>
                            <button onClick={() => { document.getElementById('profile-image-input').click() }} className='edit-btn rounded bg-primary'><small><i className='fas fa-edit me-1'></i>Edit Image</small></button>
                        </div>
                    </div>
                    <div className='profile-section-info rounded mt-4 py-2 px-4'>
                        <div className='my-3'>
                            <small className='m-0 fw-bold d-block'>Username</small>
                            <div className='d-flex'>
                                <small className='m-0'>{user.username}</small>
                                <div className='ms-auto'>

                                    <button type="button" class="edit-btn bg-primary rounded" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                                        Edit
                                    </button>
                                    {/* modal edit username */}
                                    <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModal1" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content">
                                                <button type="button" class="fas fa-times btn btn-sm ms-auto mx-2" data-bs-dismiss="modal" aria-label="Close"></button>
                                                <h5 class="text-center" id="">Change Username</h5>
                                                <small className='text-center m-0'>Enter new a new username for your account.</small>
                                                <div class="modal-body">
                                                    <div className='col-10 mx-auto' >
                                                        <label htmlFor="" className='mb-3 mt-1 label-text'>Username</label>
                                                        <div className='input-div mb-2 d-flex px-1'>
                                                            <i className='fas fa-user me-3'></i>
                                                            <input className='text-input w-100' onChange={e => setUsername(e.target.value)} type="text" placeholder={user.username} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-footer bg-secondary">
                                                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal"><small>Cancel</small></button>
                                                    <button type="button" onClick={updateUsername.bind(this, username)} class="btn btn-primary btn-sm"><small>Done</small></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className='my-3'>
                            <small className='m-0 fw-bold d-block'>Full Name</small>
                            <div className='d-flex'>
                                <small className='m-0'>{user.firstName} {user.lastName}</small>
                                <div className='ms-auto'>
                                    <button type="button" class="edit-btn bg-primary rounded" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                                        Edit
                                    </button>
                                    {/* modal edit fullname */}
                                    <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModal2" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content">
                                                <button type="button" class="fas fa-times btn btn-sm ms-auto mx-2" data-bs-dismiss="modal" aria-label="Close"></button>
                                                <h5 class="text-center" id="">Change Name</h5>
                                                <small className='text-center m-0'>Enter new name for your account.</small>
                                                <div class="modal-body">
                                                    <div className='col-10 mx-auto' >
                                                        <label htmlFor="" className='mb-3 mt-1 label-text'>First Name</label>
                                                        <div className='input-div mb-2 d-flex px-1'>
                                                            <i className='fas fa-user me-3'></i>
                                                            <input className='text-input w-100' onChange={e => setFirstname(e.target.value)} type="text" placeholder={user.firstName} />
                                                        </div>

                                                        <label htmlFor="" className='mb-3 mt-1 label-text'>First Name</label>
                                                        <div className='input-div mb-2 d-flex px-1'>
                                                            <i className='fas fa-user me-3'></i>
                                                            <input className='text-input w-100' onChange={e => setLastname(e.target.value)} type="text" placeholder={user.lastName} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-footer bg-secondary">
                                                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal"><small>Cancel</small></button>
                                                    <button type="button" onClick={updateName.bind(this, firstName, lastName)} class="btn btn-primary btn-sm"><small>Done</small></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='my-3'>
                            <small className='m-0 fw-bold d-block'>Email</small>
                            <div className='d-flex'>
                                <small className='m-0'>{user.email}</small>
                                <div className='ms-auto'>
                                    <button type="button" class="edit-btn bg-primary rounded" data-bs-toggle="modal" data-bs-target="#exampleModal3">
                                        Edit
                                    </button>
                                    {/* modal edit password */}
                                    <div class="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModal3" aria-hidden="true">
                                        <div class="modal-dialog modal-dialog-centered">
                                            <div class="modal-content">
                                                <button type="button" class="fas fa-times btn btn-sm ms-auto mx-2" data-bs-dismiss="modal" aria-label="Close"></button>
                                                <h5 class="text-center" id="">Change Email</h5>
                                                <small className='text-center m-0'>Enter new a new email for your account.</small>
                                                <div class="modal-body">
                                                    <div className='col-10 mx-auto' >
                                                        <label htmlFor="" className='mb-3 mt-1 label-text'>Email</label>
                                                        <div className='input-div mb-2 d-flex px-1'>
                                                            <i className='fas fa-envelope me-3'></i>
                                                            <input className='text-input w-100' onChange={e => setEmail(e.target.value)} type="email" placeholder={user.email} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal-footer bg-secondary">
                                                    <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal"><small>Cancel</small></button>
                                                    <button type="button" onClick={updateEmail.bind(this, email)} class="btn btn-primary btn-sm"><small>Done</small></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className='my-4' />

                <h6 className='mt-2'>Password and Security</h6>
                <button className='btn btn-sm btn-primary mt-3'><small>Change Password</small></button>
                <small className='d-block w-50 mt-2'><small>Password should be changed over time to overcome the account security vulnerabilities.</small></small>
                <hr className='my-4' />

                <h6 className='mt-2'>Account Removal</h6>
                <button className='btn btn-sm btn-outline-danger mt-3 me-1'><small>Disable Account</small></button><button className='btn btn-sm btn-danger mt-3 ms-1'><small>Remove Account</small></button>
                <small className='d-block w-50 mt-2'><small>Removing account will erase all the user profile and the data associated to it. If you just need a break from this system, you can just disable your account for some time.</small></small>


            </div>
        </div>
    </div>;
};

export default Profile;
