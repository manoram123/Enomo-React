import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Chat from './components/chat/Chat';
import Inbox from './components/chat/Inbox';
import AddFriend from './components/chat/AddFriend';
import './App.css';

import AOS from 'aos';
import Profile from './components/profile/Profile';


function App() {


    AOS.init();
    return (
        <div className='main'>
            <ToastContainer className='mt-5'></ToastContainer>
            <Router>
                <Routes>
                    <Route path='/' element={<Home></Home>}></Route>
                    <Route path='/login' element={<Login></Login>}></Route>
                    <Route path='/register' element={<Register></Register>}></Route>
                    <Route path='/chat' element={<Chat></Chat>}></Route>
                    <Route path='/add-friend' element={<AddFriend></AddFriend>}></Route>
                    <Route path='/inbox/:id' element={<Inbox></Inbox>}></Route>
                    <Route path='/profile/:userId' element={<Profile></Profile>}></Route>

                    {/* <Route path='/logout' element={<Logout></Logout>}></Route> */}

                </Routes>
            </Router>
        </div>
    )
}

export default App