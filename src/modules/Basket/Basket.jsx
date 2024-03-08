import './Basket.css'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import Header from '../UI/Header/Header'

import rubbishbin from '../img/rubbishbin.png'

export default function Basket() {
  const [basket, setBasket] = useState([])
  
  const token = localStorage.getItem('isAuth');

  const [count, setCount] = useState({});
  const [sum, setSum] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/basket', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        const data = response.data; 
        setBasket(data);
        setSum(data.reduce((total, guitar) => total + guitar.guitarCost * guitar.guitarCount, 0));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  function countPlus(guitarId) {
    const guitar = basket.find(guitar => guitar.guitarId === guitarId);
    if (count[guitarId] !== guitar.guitarAmount) {
      setCount({ ...count, [guitarId]: (count[guitarId] || 1) + 1 });
      setSum(sum + guitar.guitarCost);
      axios.put(`http://localhost:8080/basket/${guitarId}`, { action: 'plus' }, 
      {headers: { 'Authorization': `Bearer ${token}` }})
        .then(response => {
          console.log(response.data);
          window.location.reload();
        })
        .catch(error => {
          console.error(error);
        });
    }
  } 

  function countMinus(guitarId) {
    const guitar = basket.find((guitar) => guitar.guitarId === guitarId);
    if (count[guitarId] !== 1) {
      setCount({ ...count, [guitarId]: (count[guitarId] || 1) - 1 });
      setSum(sum - guitar.guitarCost);
      axios.put(`http://localhost:8080/basket/${guitarId}`, { action: 'minus' }, 
      {headers: { 'Authorization': `Bearer ${token}` }})
        .then(response => {
          console.log(response.data);
          window.location.reload();
        })
        .catch(error => {
          console.error(error);
        });
    }
  } 
  
  function removeBasket(guitarId) {
    axios({ method: 'POST', url: 'http://localhost:8080/basket/delete',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-HTTP-Method-Override': 'DELETE'
      },
      data: { guitarId: guitarId }
    })
    .then(response => {
      setBasket(basket.filter(guitar => guitar.guitarId !== guitarId));
      window.location.reload();
    })
    .catch(error => {
      console.error(error);
    });
  }  

  function removeAll() {
    axios.patch('http://localhost:8080/basket/delete', null, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(response => {
      console.log(response.data);
      setBasket([]);
      window.location.reload();
    })
    .catch(error => {
      console.error(error);
    });
  }

  function goToPay() {
    navigate('/оплата')
  }

  return (
    <div className='Basket'>
      <Header/>
      <h2 className='Basket-title'>КОРЗИНА</h2>
      <button className='deleteAll' onClick={() => removeAll()}>Удалить всё</button>
      {basket.map(guitar => (
        <div key={guitar.guitarId} className='guitarBasket'>
          <img className='basketImg' src={require(`../img/guitars/${guitar.guitarImg}.png`)} />
          <h2>{guitar.guitarName}</h2>
          <button onClick={() => countPlus(guitar.guitarId)} className='changeCount'>+</button>
            <nav className='count'>{guitar.guitarCount}шт</nav>
          <button onClick={() => countMinus(guitar.guitarId)} className='changeCount'>-</button>
          <span>{guitar.guitarCost}тг</span>
          <button id='deleteBtn' className='favoriteBtn' style={{width: '35px', height: '35px'}} onClick={() => removeBasket(guitar.guitarId)}>
            <img src={rubbishbin}  style={{width: '35px', height: '35px'}}/>
          </button>
        </div>
      ))}
      <div className='basket-end'>
        <nav>Итого: <span>{sum}тг</span></nav>
        <button onClick={goToPay}>Купить</button>
      </div>
    </div>
  )
}
