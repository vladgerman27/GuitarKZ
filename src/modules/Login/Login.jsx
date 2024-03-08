import './Login.css'

import React, {useState, useEffect} from 'react'
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

export default function Login({handleSetIsAuth}) {
    const [account, setAccount] = useState(false)

    const [loginMis, setLoginMis] = useState("")

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    const [admin, setAdmin] = useState(false)

    const navigate = useNavigate();

    const LoginBtn = async (e) => {
        e.preventDefault();

        if (email === "" || password === "") {
          setLoginMis("Пропущено поле для заполнения.")
        } else {
          try {
            const response = await axios.post(admin ? "http://localhost:8080/login_admin" : 'http://localhost:8080/login_user', { email, password });
            const { token, name, phone} = response.data;
            
            localStorage.setItem("isAuth", token);
            localStorage.setItem('userName', name);
            localStorage.setItem("userPhone", phone);
  
            handleSetIsAuth(token)
            setName(name)
            setPhone(phone)
            setAccount(true)
            navigate(admin ? '/админ' : '/главная')
          } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
              setLoginMis("Пользователь с такой почтой не найден");
            } else if (error.response && error.response.status === 402) {
              setLoginMis("Неверный пароль");
            } else {
              setLoginMis("Произошла ошибка. Пожалуйста, попробуйте снова.");
            }
          }
        }
      }

      const handleSetAdmin = () => {
        setAdmin(!admin)
      }

      const storedName = localStorage.getItem('userName')
      const storedPhone = localStorage.setItem("userPhone", phone)
      const auth = localStorage.getItem("isAuth")

      useEffect(() => {
        if (auth != null) {
          navigate('/главная')
        }
      }, [])

  return (
    <div className='Login'>
      <div className='login-form'>
        <h1>ВХОД</h1>
        <input className='login-input' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input className='login-input' type='password' placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)}/>
        <nav className='mistake'>{loginMis}</nav>
        <label><input type='checkbox' checked={admin} onChange={handleSetAdmin}/>Войти как администратор</label>
        <button onClick={LoginBtn}>Войти</button>
        <NavLink to='/регистрация'><a>Зарегистрироваться</a></NavLink>
      </div>
    </div>
  )
}
