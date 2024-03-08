import './AddBtn.css'

import React from 'react'
import axios from 'axios'

import basketImg from '../../img/basketImg.png'

export default function BasketBtn({guitar}) {
    function addBasket() {
      if (guitar.amount === 0)
      {
        alert('Товара нет в наличие')
      } else {
        const token = localStorage.getItem('isAuth');
        axios.post('http://localhost:8080/basket', { guitarId: guitar._id, guitarImg: guitar.img, guitarName: guitar.name,
         guitarAmount: guitar.amount, guitarCost: guitar.cost  },
         { headers: { Authorization: `Bearer ${token}` } })
        .then(response => { 
          console.log('Товар успешно добавлен в корзину'); 
          alert('Товар успешно добавлен в корзину')
        })
        .catch(error => { console.error(error); });
      }
    }
  
    return (
      <button className='basketBtn' onClick={addBasket}>
        <img src={basketImg} />
      </button>
    );
}
