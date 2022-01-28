import React, { useEffect } from 'react';
import Logo from '../header/Logo';
import '../styles/Chat.css';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { addScript } from '../../utilities/addscript';
import { parseJwt } from '../../auth/config';
import axios from 'axios';
import { Link } from 'react-router-dom';
import io from 'socket.io-client'
import $ from 'jquery';

const socket = io("http://localhost:90");


const Chat = () => {
    addScript('http://localhost:3000/assets/scripts/script.js');

    const token = localStorage.getItem('token');
    const user = parseJwt(token)

    const [duser, setduser] = useState()
    const [rooms, setRooms] = useState([])
    const [contacts, setContacts] = useState([])

    socket.emit("addClient", ({ userId: user.userId, socketId: socket.id }));


    useEffect(() => {
        axios.get(`/user/${user.userId}`).then(function (data) {
            setduser(data.data.data)
        })
    }, [])

    useEffect(() => {
        axios.post(`/set-status-online/${user.userId}`);
    }, []);

    useEffect(() => {
        axios.get('/rooms').then(function (result) {
            setRooms(result.data.chats)
            // console.log(result.data.chats)
        })
    }, []);

    useEffect(() => {
        for (var i = 0; i <= rooms.length; i++) {
            if (rooms[i])
                axios.get(`/chats/${rooms[i]}`).then(function (result) {
                    setContacts((list) => [...list, result.data])
                })
        }
    }, [rooms])

    useEffect(() => {
        socket.on("new-message", (data) => {
            console.log(data.message.sentBy)
            $(`#${data.message.sentBy}`).html(data.message.message)
            $(`#${data.message.sentBy}`).addClass('fw-bold')

        })
    }, [])


    // console.log(rooms)

    const setRead = (messageId, userId, sentBy) => {
        if (sentBy) {
            if (sentBy !== user.userId) {
                axios.post(`/set-message-read/${messageId}`)
            }
        }
        window.location.href = `/inbox/${userId}`
    }

    return <div>
        <div className='container mx-auto'>
            <div className="row px-md-3">
                <div className="col-md-1 side-nav-col ps-md-4">
                    <div className='side-nav h-100 d-flex align-items-center'>
                        <ul className='list-unstyled d-block mx-auto'>
                            <li className='text-center my-md-4 d-inline d-md-block mx-4 mx-md-0'><a href="/chat" className=''><i className='fas fa-comment text-light'></i></a></li>
                            <li className='text-center my-md-4 d-inline d-md-block mx-4 mx-md-0'><a href="/add-friend" className=''><i className='fas fa-user-plus text-light'></i></a></li>
                            <li className='text-center my-md-4 d-inline d-md-block mx-4 mx-md-0'><i className='fas fa-users text-light'></i></li>
                            <li className='text-center my-md-4 d-inline d-md-block mx-4 mx-md-0'><i className='fas fa-user text-light'></i></li>
                            {/* <li className='text-center my-md-4 d-inline d-md-block mx-4 mx-md-0'><i className='fas fa-cog text-light'></i></li> */}
                        </ul>
                    </div>
                </div>
                <div className='col-md-3 p-sm-3 pt-3'>
                    <div className='d-flex'>
                        {
                            duser?.image ?
                                <>

                                    <div className='d-flex profile-picture-div'>
                                        <img src={`http://localhost:90/add-friend/${duser?.image}`} className='rounded img-fluid' style={{ height: "4ch", width: "4ch", objectFit: "cover" }} alt="" />
                                        <div className='rounded-circle online-tag' style={{ border: "3px solid #fff" }}></div>
                                    </div>
                                </> :
                                <>
                                    <div className='d-flex profile-picture-div'>
                                        <div className='profile-image bg-info rounded d-flex align-items-center'><div className='text-light text-center fw-bold mx-auto'>{duser?.username.charAt(0).toUpperCase()}</div></div>
                                        <div className='rounded-circle online-tag' style={{ border: "3px solid #fff" }}></div>
                                    </div>

                                </>

                        }
                        <div className=''>
                            <span className='fw-bold mx-1 mt-2'>{duser?.username}</span>
                            <small className='mx-1 d-block'>{duser?.firstName} {duser?.lastName}</small>
                        </div>

                        <div className='ms-auto mt-1'>
                            <Link to={`/profile/${user.userId}`}><i className='fas fa-cog'></i></Link>
                        </div>
                    </div>


                    <p className='fw-bold mt-4'>Chats</p>
                    <div className='col-md-9 mb-3'>
                        <form>
                            <div className='input-div mb-2 d-flex px-1'>
                                <i className='fas fa-search me-3'></i>
                                <input className='text-input w-100' type="text" placeholder='Search user' />
                            </div>
                        </form>
                    </div>

                    <small className='m-0'>Messages</small>

                    {
                        contacts.map((val, index) => {

                            return (
                                <div key={index + 6} className='hover-box rounded px-2 py-1'>
                                    <a key={index + 7} className='friends' onClick={setRead.bind(this, val.message._id, val.id, val?.message?.sentBy)}>
                                        <div key={index} className='d-flex my-2'>
                                            {
                                                val.image ?
                                                    <div key={index + 13} className='d-flex profile-picture-div'>
                                                        <img key={index + 14} src={`http://localhost:90/add-friend/${val?.image}`} className='rounded' style={{ height: "4ch", width: "4ch", objectFit: "cover" }} alt="" />
                                                        {
                                                            val?.isActive ?
                                                                <>
                                                                    <div className='rounded-circle online-tag' style={{ border: "3px solid #fff" }}></div>
                                                                </>
                                                                :
                                                                <>
                                                                </>
                                                        }                                                    </div> :
                                                    <div key={index + 16} className='d-flex profile-picture-div'>
                                                        <div key={index + 17} className='profile-image box rounded d-flex align-items-center'><div className='text-light text-center fw-bold mx-auto'>{val.username.charAt(0).toUpperCase()}</div></div>
                                                        {
                                                            val?.isActive ?
                                                                <>
                                                                    <div className='rounded-circle online-tag' style={{ border: "3px solid #fff" }}></div>
                                                                </>
                                                                :
                                                                <>
                                                                </>
                                                        }                                                    </div>
                                            }
                                            <div key={index + 2} className=''>
                                                <span key={index + 4} className='mx-2 d-flex'><span className='fw-bold'>{val.username}</span><small className='ms-auto'><small>{val.message.time}</small></small></span>
                                                {
                                                    val.message.sentTo === user.userId ?
                                                        <>
                                                            {
                                                                val.message.isRead ?
                                                                    <small key={index + 5} id={val.id} className='mx-2 d-block message'>{val.message.message}</small>
                                                                    :
                                                                    <small key={index + 5} id={val.id} className='mx-2 d-block message fw-bold'>{val.message.message}</small>
                                                            }
                                                        </>
                                                        :
                                                        <small key={index + 5} id={val.id} className='mx-2 d-block message'>You: {val.message.message}</small>
                                                }
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='col-md-6 middle-sec pt-4'>
                    <div className='container h-100 mx-auto d-flex align-items-center'>
                        <div className='mx-auto mb-5'>
                            <div className='d-flex'>
                                {
                                    duser?.image ?
                                        <>
                                            <div className='d-flex profile-picture-div mx-auto profile-image-lg'>
                                                <img src={`http://localhost:90/add-friend/${duser?.image}`} className='rounded img-fluid' style={{ height: "8ch", width: "8ch", objectFit: "cover" }} alt="" />
                                                <div className='rounded-circle online-tag'></div>
                                            </div>
                                        </> :
                                        <>
                                            <div className='box rounded profile-picture-div profile-image-lg rounded d-flex align-items-center'>
                                                <p className='m-0 mx-auto fw-bold text-light' style={{ fontSize: "2em" }}>{duser?.username?.charAt(0).toUpperCase()}</p>
                                            </div>
                                        </>
                                }
                            </div>
                            <p className='m-0 text-center fw-bold'>Hey {duser?.username}! </p>
                            <p className='m-0 text-center'>Select friend to start a conversation.</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                </div>
            </div>
        </div>
    </div >;
};

export default Chat;
