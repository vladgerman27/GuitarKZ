import './Header.css'

import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  NavLink,
  BrowserRouter,
  useNavigate
} from "react-router-dom"

import Logo from '../../img/logo.png'

export default function Header() {
    const [account, setAccount] = useState(false)

    const navigate = useNavigate()

    const Logout = () => {
        localStorage.removeItem('isAuth');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhone');
        setAccount(false);
        navigate('/')
      };

  return (
    <header>
        <NavLink to='/главная'><img className='logo' src={Logo} /></NavLink>

        <div className='pages-links'>
            <NavLink to='/главная'><a>Главная</a></NavLink>
            <NavLink to='/контакты'><a>Контакты</a></NavLink>
            <NavLink to='/избранное'><a>Избранное</a></NavLink>
            <NavLink to='/корзина'><a>Корзина</a></NavLink>
        </div>
    
        <button onClick={Logout}>Выйти</button>
    </header>
  )
}

