import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css'

const Logo = () => {
    return <div>
        <Link to='/' className='nav-link'>
            <div className='logo'>
                <span className='logo-prefix'>Eno</span><span className=''>Mo</span>
            </div>
        </Link>

    </div>;
};

export default Logo;
