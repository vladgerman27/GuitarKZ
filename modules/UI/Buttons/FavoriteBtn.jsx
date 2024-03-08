import './AddBtn.css'

import React from 'react'
import axios from 'axios'

import favoriteImg from '../../img/favoriteImg.png'

export default function FavoriteBtn({guitar}) {
    function addFavorite() {
        const token = localStorage.getItem('isAuth');
        axios.post('http://localhost:8080/favorites', {
            guitarId: guitar._id,
            guitarImg: guitar.img,
            guitarName: guitar.name,
            guitarCost: guitar.cost,
            guitarAmount: guitar.amount
          },
          { headers: { Authorization: `Bearer ${token}` } })
          .then(response => {
            console.log('Товар успешно добавлен в избраннoе'); 
            alert('Товар успешно добавлен в избраннoе')
          })
          .catch(error => { console.error(error); });
      }
  
    return (
      <button className='favoriteBtn' onClick={addFavorite}>
        <img src={favoriteImg} />
      </button>
    );
}
