import './Favorites.css'

import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'

import Header from '../UI/Header/Header'

import basketImg from '../img/basketImg.png'
import rubbishbin from '../img/rubbishbin.png'

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem('isAuth');

  useEffect(() => {
    axios.get('http://localhost:8080/favorites', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setFavorites(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const addCart = useCallback((guitarId, guitarImg, guitarName, guitarCost, guitarAmount) => {
    axios.post('http://localhost:8080/basket', {
        guitarId: guitarId,
        guitarImg: guitarImg,
        guitarName: guitarName,
        guitarCost: guitarCost,
        guitarAmount: guitarAmount
      },
      { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        console.log('Книга успешно добавлена в корзину');
        const updatedCart = favorites.map(guitar => {
          if (guitar.guitarId === guitarId) {
            return {
              ...guitar,
            };
          }
          return guitar;
        });
        setFavorites(updatedCart);
      })
      .catch(error => { console.error(error); });
  }, [favorites, token]);

  function removeFavorite(guitarId) {
    axios({ method: 'POST', url: 'http://localhost:8080/favorites/delete',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-HTTP-Method-Override': 'DELETE'
      },
      data: { guitarId: guitarId }
    })
    .then(response => {
      setFavorites(favorites.filter(guitar => guitar.guitarId !== guitarId));
    })
    .catch(error => {
      console.error(error);
    });

    axios.get('http://localhost:8080/favorites', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      setFavorites(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }  

  function removeAll() {
    axios.patch('http://localhost:8080/favorites/delete', null, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(response => {
      console.log(response.data);
      setFavorites([]);
    })
    .catch(error => {
      console.error(error);
    });

    axios.get('http://localhost:8080/favorites', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      setFavorites(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }

  return (
    <div className='Favorites'>
        <Header/>
        <h2>ИЗБРАННОЕ</h2>
        <button className='deleteAll' onClick={() => removeAll()}>Удалить всё</button>
        <div className='favoritesList'>
          {favorites.map(guitar => (
            <div key={guitar.guitarId} className='guitar'>
              <img src={require(`../img/guitars/${guitar.guitarImg}.png`)} />
              <nav><b>{guitar.guitarName}</b></nav>
              <span>{guitar.guitarCost}тг</span>
              <div className='buttons'>
                <button className='basketBtn' onClick={() => addCart(guitar.guitarId, guitar.guitarImg, guitar.guitarName, guitar.guitarCost, guitar.guitarAmount)}>
                  <img src={basketImg} />
                </button>
                <button className='favoriteBtn' style={{width: '35px', height: '35px'}} onClick={() => removeFavorite(guitar.guitarId)}>
                  <img src={rubbishbin}  style={{width: '35px', height: '35px'}}/>
                </button>
              </div>
            </div>
          ))}
        </div>
        
    </div>
  )
}

