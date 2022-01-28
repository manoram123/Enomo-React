import React, { useEffect } from 'react'
import axios from 'axios';
import { useParams } from 'react-router';
import { useState } from 'react';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import $ from 'jquery';
import '../chat/Inbox.css';
import { addScript } from '../../utilities/addscript';
import { parseJwt } from '../../auth/config'
import { Link } from 'react-router-dom';


const socket = io.connect("http://localhost:90/");


const Inbox = () => {
    addScript('http://localhost:3000/assets/scripts/script.js');

    // getting userId from token
    const token = localStorage.getItem('token');
    const user = parseJwt(token)

    var id = useParams().id;

    const [roomId, setRoomId] = useState('');
    const [messages, setMessages] = useState([]);
    const [contact, setContact] = useState([]);
    const [duser, setduser] = useState()

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
        axios.post(`/inbox/${id}`).then(function (result) {
            setRoomId(result.data.roomId);
            setMessages(result.data.messagesData);
            setContact([result.data.contact]);
        });
    }, [])

    // Getting contacts from database

    const [rooms, setRooms] = useState([])
    const [contacts, setContacts] = useState([])

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
                    // console.log(result.data)
                    setContacts((list) => [...list, result.data])
                })
        }
    }, [rooms])

    // User is tying
    const isTyping = () => {
        socket.emit("typing", ({ roomId: roomId, user: user.userId }));
    }

    useEffect(() => {

        socket.on("isTyping", (data) => {
            if (data.user !== user.userId) {
                console.log(data.typing)
                $('.is-typing').css("display", 'block')
            }
        })

        socket.on("notTyping", (data) => {
            if (data.user !== user.userId) {
                $('.is-typing').css("display", 'none')
            }
        })
    }, [])

    // User is cancelled typing
    const isNotTyping = () => {
        socket.emit("not-typing", ({ roomId: roomId, user: user.userId }));
    }


    socket.emit("join_room", { roomId: roomId, user: user.userId });


    const [message, setMessage] = useState('');

    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    const sendMessage = async (e) => {
        e.preventDefault();

        const messageData = {
            roomId: roomId,
            message: message,
            sentBy: user.userId,
            sentTo: id,
            date: new Date(Date.now()),
            time: formatAMPM(new Date(Date.now()))
        }
        await socket.emit("send_message", messageData);
        $('#message-form')[0].reset();
        $(`#${messageData.sentTo}`).html(`You: ${messageData.message}`)
        setMessage("");
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(data);
            setMessages((list) => [...list, data]);
        });
    }, [socket])

    useEffect(() => {
        socket.on("new-message", (data) => {
            console.log(data.message.sentBy)
            $(`#${data.message.sentBy}`).html(data.message.message)
            $(`#${data.message.sentBy}`).addClass('fw-bold')
        })
    }, [])

    const setRead = (messageId, userId, sentBy) => {
        if (sentBy) {
            if (sentBy !== user.userId) {
                axios.post(`/set-message-read/${messageId}`)
            }
        }
        window.location.href = `/inbox/${userId}`
    }

    return (
        <>
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
                                        <a key={index + 7} className='friends' onClick={setRead.bind(this, val?.message?._id, val?.id, val?.message?.sentBy)}>
                                            <div key={index} className='d-flex my-2'>
                                                {
                                                    val.image ?
                                                        <div key={index + 13} className='d-flex profile-picture-div'>
                                                            <img key={index + 14} src={`http://localhost:90/add-friend/${val?.image}`} className='rounded' style={{ height: "4ch", width: "4ch", objectFit: "cover" }} alt="" />
                                                            {
                                                                val?.isActive ?
                                                                    <>
                                                                        <div key={index + 45} className='rounded-circle online-tag' style={{ border: "3px solid #fff" }}></div>
                                                                    </>
                                                                    :
                                                                    <>
                                                                    </>
                                                            }
                                                        </div> :
                                                        <div key={index + 16} className='d-flex profile-picture-div'>
                                                            <div key={index + 17} className='profile-image box rounded d-flex align-items-center'><div key={index + 99} className='text-light text-center fw-bold mx-auto'>{val.username.charAt(0).toUpperCase()}</div></div>
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
                                                    <span key={index + 4} className='mx-2 d-flex'><span className='fw-bold'>{val.username}</span><small className='ms-auto me-2'><small>{val.message.time}</small></small></span>
                                                    {
                                                        val.message.sentTo === user.userId ?
                                                            <>
                                                                {
                                                                    val.message.isRead ?
                                                                        <small key={index + 5} id={val.id} className='mx-2 d-block message'>{val.message.message}</small>
                                                                        :
                                                                        <small key={index + 55} id={val.id} className='mx-2 d-block message fw-bold'>{val.message.message}</small>
                                                                }
                                                            </>
                                                            :
                                                            <small key={index + 555} id={val.id} className='mx-2 d-block message'>You: {val.message.message}</small>
                                                    }
                                                </div>
                                            </div>
                                        </a>

                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='col-md-6 middle-sec pt-4 p-0'>
                        <div className='pb-5 pt-2 px-3 p-0'>
                            <div className='container-fluid p-0 mt-2'>
                                <div className='d-flex'>
                                    {
                                        contact.map((val, index) => {
                                            return (
                                                <div key={index + 8}>
                                                    <div key={index} className='d-flex'>
                                                        <div key={index + 1} className='profile-image box rounded d-flex align-items-center'><div key={index + 2} className='text-light text-center fw-bold mx-auto'>{val.username.charAt(0).toUpperCase()}</div></div>

                                                        <div key={index + 3} className=''>
                                                            <span key={index + 4} className='fw-bold mx-1 mt-2'>{val.username}</span>
                                                            <small key={index + 5} className='mx-1 d-block'>{val.firstName} {val.lastName}</small>
                                                        </div>
                                                    </div>
                                                    <small key={index + 9} className='mx-1 d-block'><i key={index + 10} className='fas fa-circle text-success me-1' style={{ "fontSize": ".4em" }}></i><small key={index + 11}>Online</small></small>
                                                </div>

                                            )
                                        })
                                    }

                                </div>
                            </div>
                            <hr className='container m-0 p-0' />
                            <ScrollToBottom className='message-container pt-1'>
                                {
                                    messages.map((val, index) => {
                                        if (val.sentTo === user.userId) {
                                            return (
                                                // <p key={index} className='text-muted p-0 rounded border px-1 border-secondary'>{val.message}</p>
                                                <div className="receive d-flex" key={index}>
                                                    <div className="msg" key={index + 1}>
                                                        <p className='receive-text text-light mx-1 px-2 py-1 rounded' key={index + 2}>{val.message}</p>
                                                        {/* <small class='timestamp mx-1 px-2 py-1' key={index}>{val.time}</small> */}
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            return (<div className="sent d-flex" key={index + 3}>
                                                <div className="msg ms-auto" key={index + 4}>
                                                    <p className='text-light mx-1 px-2 py-1 rounded' key={index + 5}>{val.message}</p>
                                                    {/* <span class='timestamp mx-1 px-2 py-1' key={index}>{{ m.timestamp | timesince }} ago</span> */}
                                                </div>
                                            </div>)
                                        }
                                    })
                                }
                                <div className='is-typing mb-2'><small>Typing...</small></div>
                            </ScrollToBottom>
                            <hr className='container p-0 m-0' />
                            <form id='message-form' className='mt-2' onSubmit={sendMessage}>
                                <div className='input-group col-12'>
                                    <div className='input-div w-100 d-flex'>
                                        <input type="text" onChange={(e) => setMessage(e.target.value)} onFocus={isTyping} onBlur={isNotTyping} placeholder='Type message here...' className='text-input w-100' />
                                        <button type='submit' className='action-btn py-2 px-2'><i className='fas fa-paperclip d-block'></i></button>
                                        <button type='submit' className='action-btn py-2 px-1'><i className='fas fa-smile d-block'></i></button>
                                        <button type='submit' className='send-btn py-2 px-3'><i className='fas fa-paper-plane d-block'></i></button>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                    <div className='col-md-3'>

                    </div>
                </div>
            </div>
            <script src="http://localhost:3000/assets/scripts/script.js"></script>

        </>
    )
}

export default Inbox
