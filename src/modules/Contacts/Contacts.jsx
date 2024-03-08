import './Contacts.css'

import React, {useState, useEffect} from 'react'

import Header from '../UI/Header/Header'

export default function Contacts() {
    const [shops, setShops] = useState([])

    useEffect(() => {
        fetch('http://localhost:8080/shops')
          .then(res => res.json())
          .then(data => setShops(data))
          .catch(error => console.log(error));
      }, []);

  return (
    <div className='Contacts'>
      <Header/>

      <h1>НАШИ ТОЧКИ</h1>
      <div className='shops'>
        {shops.map(shop => (
            <div className='shop' key={shop._id}>
                <nav><b>Адресс:</b> {shop.adress}</nav>
                <nav><b>Телефон:</b> {shop.phones}</nav>
                <nav><b>Время работы:</b> {shop.times}</nav>
            </div>
        ))}
      </div>
    </div>
  )
}
