import './App.css';

import React, {useState, useEffect} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  NavLink,
  BrowserRouter,
  useNavigate
} from "react-router-dom"

import Login from './modules/Login/Login';
import SingUp from './modules/SingUp/SingUp';
import Main from './modules/Main/Main';
import Pages from './modules/Pages/Pages';
import Favorites from './modules/Favorites/Favorites';
import Basket from './modules/Basket/Basket';
import Menu from './modules/Admin/Menu/Menu';
import Payment from './modules/Payment/Payment';
import Contacts from './modules/Contacts/Contacts';

function App() {
  const token = localStorage.getItem('isAuth');
  const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth'));
  const handleSetIsAuth = (token) => {
    setIsAuth(token);
  };

  const [guitars, setGuitars] = useState([])

  useEffect(() => {
    fetch('http://localhost:8080/guitars')
      .then(res => res.json())
      .then(data => setGuitars(data))
      .catch(error => console.log(error));
  }, []);

  return (
    <Router className="App">
      <Routes>
        <Route path="/" element={<Login handleSetIsAuth={handleSetIsAuth} />} />
        <Route path="/регистрация" element={<SingUp handleSetIsAuth={handleSetIsAuth} />} />
        <Route path="/главная" element={<Main/>}/>
        <Route path="/:category" element={<Pages guitars={guitars} />} />
        <Route path='/избранное' element={<Favorites/>}/>
        <Route path='/корзина' element={<Basket/>}/>
        <Route path='/админ' element={<Menu/>}/>
        <Route path='/оплата' element={<Payment/>}/>
        <Route path='/контакты' element={<Contacts/>}/>
      </Routes>
    </Router>
  );
}

export default App;