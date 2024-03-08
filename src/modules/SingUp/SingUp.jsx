import './SingUp.css'

import React, {useState} from 'react'
import {
    BrowserRouter as Router,
    Route,
    Link,
    Routes,
    NavLink,
    BrowserRouter,
    useNavigate
  } from "react-router-dom"
  import axios from 'axios'

export default function SingUp({handleSetIsAuth}) {
    const [account, setAccount] = useState(false)

    const [singupMis, setSingupMis] = useState("")

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    const [admin, setAdmin] = useState(false)

    const navigate = useNavigate();
    
    const Register = async (e) => {
      e.preventDefault();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^(\+7|8)(7\d{2}|77\d{1})\d{7}$/;

      if (name === "" || email === "" || phone === "" || password === "" || confirmPassword === "") {
        setSingupMis("Пропущено поле. Повторите ввод.");
      } else if(confirmPassword !== password) {
        setSingupMis("Введен неверный пароль. Повторите ввод.");
      } else if(!emailRegex.test(email)) {
        setSingupMis("Такой почты не существует. Повторите ввод.")
      } else if(!phoneRegex.test(phone)) {
        setSingupMis("Такого телефона не существует. Повторите ввод.")
      } else {
        try {
          const userData = {
            email,
            password,
            name,
            phone,
          };
  
          const response = await axios.post(admin ? 'http://localhost:8080/register_admin' : 'http://localhost:8080/register_user', userData);
  
          localStorage.setItem('isAuth', response.data.token);
          localStorage.setItem('userName', name);
          localStorage.setItem('userPhone', phone);
          handleSetIsAuth(response.data.token);
          setAccount(true);
          navigate(admin ? '/админ' : '/главная');
        } catch (error) {
          console.error(error);
          if (error.response && error.response.status === 401) {
            setSingupMis("Пользователь с такой почтой уже зарегистрирован");
          } else {
            setSingupMis("Произошла ошибка. Пожалуйста, попробуйте снова.");
          }
        }
      }
    }

    const handleSetAdmin = () => {
      setAdmin(!admin)
    }

  return (
    <div className='Singup'>
      <div className='singup-form'>
        <h1>РЕГИСТРАЦИЯ</h1>
        <input className='singup-input' placeholder='Логин' value={name} onChange={(e) => setName(e.target.value)}/>
        <input className='singup-input' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input className='singup-input' placeholder='Телефон' value={phone} onChange={(e) => setPhone(e.target.value)}/>
        <input className='singup-input' type='password' placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)}/>
        <input className='singup-input' type='password' placeholder='Повторите пароль' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
        <label><input type='checkbox' checked={admin} onChange={handleSetAdmin}/>Зарегистритроваться как администратор</label>
        <nav className='mistake'>{singupMis}</nav>
        <button onClick={Register}>Зарегистрироваться</button>
      </div>
    </div>
  )
}
