import React from 'react';
import { useState, useEffect } from 'react';
import { parseJwt } from '../../auth/config';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Logo from '../header/Logo';
import '../styles/Chat.css';
import { addScript } from '../../utilities/addscript';
import io from 'socket.io-client';
import $ from 'jquery';

const socket = io("http://localhost:90");

const AddFriend = () => {


    addScript('http://localhost:3000/assets/scripts/script.js');

    const [duser, setduser] = useState()
    const [users, setusers] = useState([])
    const [friendReqs, setFriendReqs] = useState([])
    // var friendReqs = [];
    const [friendReqsUsers, setfriendReqsUsers] = useState([])
    const [sentReqs, setSents] = useState([])
    const [rooms, setRooms] = useState([])
    const [contacts, setContacts] = useState([])
    const [notifications, setNotifications] = useState([])
    const token = localStorage.getItem('token');
    const user = parseJwt(token)


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
        const fre = async () => {
            const data = await axios.get('/friend-requests')
            setFriendReqs(data.data.data)
            // friendReqs = [...friendReqs, data.data.data]
            console.log(friendReqs)
        }
        fre()

    }, [])


    useEffect(() => {
        axios.get(`/sent-requests`).then(function (data) {
            setSents(data.data.data)
            // console.log(data.data.data)
        })
    }, []);

    useEffect(() => {
        socket.on("sent-request", (data) => {
            if (data.type === "success") {
                toast.success(data.message, { position: toast.POSITION.TOP_RIGHT });

            } else {
                toast.error(data.message, { position: toast.POSITION.TOP_RIGHT });
            }
        })
    }, [])

    useEffect(() => {
        socket.on("accepted-request", (data) => {
            axios.get(`/chats/${data.roomId}`).then(function (data) {
                console.log(data.data)
                setContacts((list) => [...list, data.data])
            })
        })
    }, [])


    useEffect(() => {
        socket.on("notification", (data) => {
            // console.log(data);
            if (data.request) {  //if the notification is about receiving friend request
                axios.get(`/friend-requests`).then(function (data) {
                    setFriendReqs(data.data.data)
                    // friendReqs = [data.data.data]
                });
            } else if (data.accepted) { // if notification is about accepting friend request
                console.log(data.accepted)
                axios.get(`/chats/${data.accepted}`).then(function (data) {
                    console.log(data.data);
                    setContacts((list) => [...list, data.data])
                })
            }
            $('.notification-identifier').css("display", "block")
            $('.accepted-notifier').css("display", 'block')
        })
    }, [])

    socket.on("test", (data) => {
        // console.log(data)
    })

    useEffect(() => {
        axios.get('/user/users').then(function (data) {
            setusers(data.data.data)
            // console.log(data.data.data)
        })
    }, [])

    useEffect(() => {
        axios.get('/rooms').then(function (result) {
            setRooms(result.data.chats)
            // console.log(result.data.chats)
        });

    }, []);

    useEffect(() => {
        for (var i = 0; i <= rooms.length; i++) {
            if (rooms[i])
                axios.get(`/chats/${rooms[i]}`).then(function (result) {
                    // console.log(result.data)
                    setContacts((list) => [...list, result.data])
                    // console.log(setContacts)
                })
        }
    }, [rooms])


    const addFriend = (contact_id, index) => {
        socket.emit("create-chatroom", { socket: socket.id, user: user.userId, contact: contact_id })
        $(`#${index}`).css('display', "none")
    }


    const acceptFriendRequest = (sender, index) => {
        socket.emit("accept-request", { receiver: user.userId, sender: sender });
        $(`#${index}`).css('display', 'none')
    }

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

    const tabClick = (option, index) => {
        if (option === "all") {
            $('.tab-pending').css("display", "none")
            $('.tab-all').css("display", "block")
            $('.tab-online').css("display", "none")
            $('.tab-add-frined').css("display", "block")
            $('.tab-option').removeClass("tab-option-active")
            $('.tab-option').eq(index).addClass("tab-option-active")

        } else if (option === "pending") {
            $(".tab-all").css("display", "none")
            $(".tab-pending").css("display", "block")
            $('.tab-online').css("display", "none")
            $('.tab-add-friend').css("display", "none")
            $('.notification-identifier').css("display", "none")
            $('.tab-option').removeClass("tab-option-active")
            $('.tab-option').eq(index).addClass("tab-option-active")


        } else if (option === "online") {
            $('.tab-pending').css("display", "none")
            $('.tab-all').css("display", "none")
            $(".tab-online").css("display", "block")
            $(".tab-add-friend").css("display", "none")
            $('.tab-option').removeClass("tab-option-active")
            $('.tab-option').eq(index).addClass("tab-option-active")


        }
        else if (option === "add-friend") {
            $('.tab-pending').css("display", "none")
            $('.tab-all').css("display", "none")
            $(".tab-online").css("display", "none")
            $(".tab-add-friend").css("display", "block")
            $('.tab-option').removeClass("tab-option-active")
            $('.tab-option').eq(index).addClass("tab-option-active")
        }
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
                <div className='col-md-3 p-sm-3 pt-3 sidebar'>
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
                                        <div className='profile-image box rounded d-flex align-items-center'><div className='text-light text-center fw-bold mx-auto'>{duser?.username.charAt(0).toUpperCase()}</div></div>
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
                                                <span key={index + 4} className='mx-2 d-flex'><span className='fw-bold'>{val.username}</span><small className='ms-auto me-2'><small>{val.message.time}</small></small></span>
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
                    <div className='container p-0 mx-auto d-flex'>
                        <span className='d-inline fw-bold'><i className='fas fa-user me-2'></i>Friends</span>
                        <ul className='list-unstyled'>
                            <li className='d-inline mx-2'><button onClick={tabClick.bind(this, "online", 0)} className='tab-option rounded py-0 px-2 m-0'>Online</button></li>
                            <li className='d-inline mx-2'><button onClick={tabClick.bind(this, "all", 1)} className='tab-option tab-option-active rounded py-0 px-2 m-0'>All</button></li>
                            <li className='d-inline mx-2'><button onClick={tabClick.bind(this, "pending", 2)} className='tab-option rounded py-0 px-2 m-0'>Pending <div className='notification-identifier mb-1 rounded-circle mx-auto'></div></button></li>
                            <li className='d-inline mx-2'><button onClick={tabClick.bind(this, "add-friend", 3)} className='tab-option rounded py-0 px-2 m-0'>Add Friend</button></li>
                        </ul>
                    </div>
                    <hr className='container p-0 m-0 mx-auto mb-4' />

                    <div className='tab tab-all'>
                        <div className='mb-4 mt-2'>
                            <form>
                                <div className='input-div input-div-lg mb-2 d-flex pt-2 pb-1 rounded px-2'>
                                    <i className='fas fa-search me-2'></i>
                                    <input className='text-input w-100' type="text" placeholder='Search user' />
                                </div>
                            </form>
                        </div>

                        <p className='m-0 mb-2'> <small>All Friends ({contacts.length})</small></p>
                        {
                            contacts.map((val, index) => {

                                return (
                                    <div key={index + 6} className='friend hover-box d-flex'>
                                        <a key={index + 7} href={`/inbox/${val.id}`} className='friends w-100'>
                                            <div key={index} className='d-flex my-2'>
                                                {
                                                    val.image ?
                                                        <div key={index + 14} className='d-flex profile-picture-div'>
                                                            <img key={index + 15} src={`http://localhost:90/add-friend/${val.image}`} className='rounded img-fluid' style={{ height: "4ch", width: "4ch", objectFit: "cover" }} alt="" />
                                                            {
                                                                val?.isActive ?
                                                                    <div className='rounded-circle online-tag' style={{ border: "3px solid #fff" }}></div>
                                                                    :
                                                                    <>
                                                                    </>
                                                            }                                                           </div> :
                                                        <div key={index + 16} className='d-flex profile-picture-div'>
                                                            <div key={index + 17} className='profile-image box rounded d-flex align-items-center'><div className='text-light text-center fw-bold mx-auto'>{val.username.charAt(0).toUpperCase()}</div></div>
                                                            {
                                                                val?.isActive ?
                                                                    <div className='rounded-circle online-tag' style={{ border: "3px solid #fff" }}></div>
                                                                    :
                                                                    <>
                                                                    </>
                                                            }                                                           </div>
                                                }
                                                <div key={index + 2} className=''>
                                                    <span key={index + 4} className='fw-bold mx-1 mt-2'>{val.username}</span>
                                                    <small key={index + 5} className='mx-1 d-block'>{val.firstName} {val.lastName}</small>
                                                </div>
                                            </div>
                                        </a>
                                        <div key={index + 8} className='actions ms-auto mt-2 d-flex'>
                                            <a key={index + 9} href={`/inbox/${val.id}`} className='btn rounded-circle'><i className='fas fa-comment-alt'></i></a>
                                            <a key={index + 10} className='btn rounded-circle'><i className='fas fa-ellipsis-v'></i></a>
                                        </div>

                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="tab tab-pending">
                        {friendReqs.length > 0 ?
                            <p className='m-0 mb-2'> <small>Friend Requests ({friendReqs.length})</small></p>
                            :
                            <></>
                        }

                        {
                            friendReqs.map((val, index) => {
                                return (
                                    <div key={index + 12}>
                                        <div key={index + 11} id={index} className='friend'>
                                            <div key={index + 1}>
                                                <div key={index + 2} className='d-flex my-2'>
                                                    {
                                                        val?.sender?.image ?
                                                            <div className='d-flex profile-picture-div'>
                                                                <img key={index + 16} src={`http://localhost:90/add-friend/${val?.sender?.image}`} className='rounded img-fluid' style={{ height: "4ch", width: "4ch", objectFit: "cover" }} alt="" />
                                                            </div> :
                                                            <div key={index + 1} className='profile-image box rounded d-flex align-items-center'><div key={index + 3} className='text-light text-center fw-bold mx-auto'>{val?.sender?.username.charAt(0).toUpperCase()}</div></div>
                                                    }                                                    <div key={index + 4} className=''>
                                                        <span key={index + 5} className='fw-bold mx-1 mt-2'>{val?.sender?.username}</span>
                                                        <small key={index + 6} className='mx-1 d-block'>{val?.sender?.firstName} {val?.sender?.lastName}</small>
                                                    </div>
                                                    <div key={index + 8} className='ms-auto mt-1'>
                                                        <button key={index + 10} onClick={acceptFriendRequest.bind(this, val?.sender?._id, index)} className='btn'><i key={index + 9} className='fas fa-user-check text-primary me-1'></i></button>
                                                    </div>
                                                </div>
                                            </ div>
                                        </div>

                                    </div>
                                )

                            })
                        }

                        {
                            sentReqs.length > 0 ?
                                <p className='m-0 mb-2'> <small>Sent Requests ({sentReqs.length})</small></p>
                                :
                                <></>
                        }
                        {
                            sentReqs.map((val, index) => {

                                return (
                                    <div key={index + 13}>
                                        <div key={index + 11} className='friend'>

                                            <div key={index + 1}>
                                                <div key={index + 2} className='d-flex my-2'>
                                                    {
                                                        val?.receiver?.image ?
                                                            <div className='d-flex profile-picture-div'>
                                                                <img key={index + 16} src={`http://localhost:90/add-friend/${val?.receiver?.image}`} className='rounded img-fluid' style={{ height: "4ch", width: "4ch", objectFit: "cover" }} alt="" />
                                                            </div> :
                                                            <div key={index + 1} className='profile-image box rounded d-flex align-items-center'><div key={index + 3} className='text-light text-center fw-bold mx-auto'>{val?.receiver?.username.charAt(0).toUpperCase()}</div></div>
                                                    }                                                     <div key={index + 4} className=''>
                                                        <span key={index + 5} className='fw-bold mx-1 mt-2'>{val?.receiver?.username}</span>
                                                        <small key={index + 6} className='mx-1 d-block'>{val?.receiver?.firstName} {val?.receiver?.lastName}</small>
                                                    </div>
                                                    <div key={index + 15} className='badge bg-success accepted-notifier h-25 mt-1'>Accepted</div>

                                                    <div key={index + 8} className='ms-auto mt-1'>
                                                        <button key={index + 10} className='btn'><i key={index + 9} className='fas fa-times text-primary me-1'></i></button>
                                                    </div>
                                                </div>
                                            </ div>
                                        </div>
                                    </div>
                                )
                            })
                        }


                    </div>

                    <div className="tab tab-online">
                        {
                            contacts.map((val, index) => {

                                return (
                                    <>
                                        {val?.isActive ?
                                            <div key={index + 6} className='friend hover-box d-flex'>
                                                <a key={index + 7} href={`/inbox/${val.id}`} className='friends w-100'>
                                                    <div key={index} className='d-flex my-2'>
                                                        {
                                                            val.image ?
                                                                <div key={index + 14} className='d-flex profile-picture-div'>
                                                                    <img key={index + 15} src={`http://localhost:90/add-friend/${val.image}`} className='rounded img-fluid' style={{ height: "4ch", width: "4ch", objectFit: "cover" }} alt="" />
                                                                    <div className='rounded-circle online-tag' style={{ border: "3px solid #fff" }}></div>
                                                                </div> :
                                                                <div key={index + 16} className='d-flex profile-picture-div'>
                                                                    <div key={index + 17} className='profile-image box rounded d-flex align-items-center'><div className='text-light text-center fw-bold mx-auto'>{val.username.charAt(0).toUpperCase()}</div></div>
                                                                    <div className='rounded-circle online-tag' style={{ border: "3px solid #fff" }}></div>
                                                                </div>
                                                        }
                                                        <div key={index + 2} className=''>
                                                            <span key={index + 4} className='fw-bold mx-1 mt-2'>{val.username}</span>
                                                            <small key={index + 5} className='mx-1 d-block'>{val.firstName} {val.lastName}</small>
                                                        </div>
                                                    </div>
                                                </a>
                                                <div key={index + 8} className='actions ms-auto mt-2 d-flex'>
                                                    <a key={index + 9} href={`/inbox/${val.id}`} className='btn rounded-circle'><i className='fas fa-comment-alt'></i></a>
                                                    <a key={index + 10} className='btn rounded-circle'><i className='fas fa-ellipsis-v'></i></a>
                                                </div>

                                            </div> :
                                            <></>
                                        }
                                    </>
                                )
                            })
                        }
                    </div>
                    <div className="tab tab-add-friend">
                        <p className='m-0 fw-bold'><small>Add Friend</small></p>
                        <p className='m-0'><small>Find friends with ther Username.</small></p>
                        <div className='mb-4 mt-3'>
                            <form>
                                <div className='input-div input-div-lg mb-2 d-flex pt-2 pb-2 rounded px-2'>
                                    <i className='fas fa-search me-2'></i>
                                    <input className='text-input w-100' type="text" placeholder='Enter a Username' />
                                </div>
                            </form>
                        </div>
                        <div className='d-none'>
                            <p className='m-0'><small>Results</small></p>

                        </div>

                        <small className='m-0'>Suggestions:</small>

                        {
                            users.map((val, index) => {
                                if (val._id.toString() !== user.userId.toString()) {
                                    return (
                                        <div key={index + 1} id={index} className='friend-suggestion'>
                                            <div key={index + 2} className='d-flex my-2'>
                                                {
                                                    val?.image ?
                                                        <div className='d-flex profile-picture-div'>
                                                            <img key={index + 16} src={`http://localhost:90/add-friend/${val?.image}`} className='rounded img-fluid' style={{ height: "4ch", width: "4ch", objectFit: "cover" }} alt="" />
                                                        </div> :
                                                        <div key={index + 1} className='profile-image box rounded d-flex align-items-center'><div key={index + 3} className='text-light text-center fw-bold mx-auto'>{val?.username.charAt(0).toUpperCase()}</div></div>
                                                }                                                 <div key={index + 4} className=''>
                                                    <span key={index + 5} className='fw-bold mx-1 mt-2'>{val.username}</span>
                                                    <small key={index + 6} className='mx-1 d-block'>{val.firstName} {val.lastName}</small>
                                                </div>
                                                <div key={index + 8} className='ms-auto mt-1'>
                                                    <button onClick={addFriend.bind(this, val._id, index)} className='btn'><i key={index + 9} className='fas fa-user-plus text-primary me-1'></i></button>
                                                </div>
                                            </div>
                                        </ div>
                                    )
                                }
                            })
                        }
                    </div>

                </div>
                <div className='col-md-3'>

                </div>
            </div>
        </div>
    </div>;
};

export default AddFriend;
