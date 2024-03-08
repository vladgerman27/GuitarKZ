import './Payment.css'

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const token = localStorage.getItem('isAuth');
  const [paymentMethod, setPaymentMethod] = useState('');

  const [basket, setBasket] = useState([]);
  const [sum, setSum] = useState(0);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const [number, setNumber] = useState('')
  const [date, setDate] = useState('')
  const [code, setCode] = useState('')
  const [adress, setAdress] = useState('')

  useEffect(() => {
    axios.get('http://localhost:8080/basket', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => {
        setBasket(response.data);
        setSum(response.data.reduce((total, guitar) => total + guitar.guitarCost * guitar.guitarCount , 0));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const Continue = async (e) => {
    e.preventDefault();
    if (!document.querySelector("input[name='paymentMethod']:checked") || adress == "") {
      setErr("Вы не выбрали способ оплаты или не вписали адресс")
    } else if (paymentMethod === "cash") {
        try {
            for (const guitar of basket) {
              if (guitar.paymentMethod === "cash") {
                const response = await axios.patch(`http://localhost:8080/guitars/${guitar._id}`, {
                  amount: guitar.amount - guitar.guitarCount
                });
              }
            }
      
            const response = await axios.patch('http://localhost:8080/basket/delete', {
              paymentMethod
            }, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            setBasket([]);
            navigate('/главная');
          } catch (error) {
            console.error(error);
            setErr('Ошибка на сервере');
          }
    } else if (paymentMethod === "card") {
        if (number ==="" || date === "" || code === "" ) {
            setErr("Пропущено поле для заполнения")
        } else {
            try {
                for (const guitar of basket) {
                  if (guitar.paymentMethod === "card") {
                    const response = await axios.patch(`http://localhost:8080/guitars/${guitar._id}`, {
                      amount: guitar.amount - guitar.guitarCount
                    });
                  }
                }
          
                const response = await axios.patch('http://localhost:8080/basket/delete', {
                  paymentMethod
                }, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                setBasket([]);
                navigate('/главная');
              } catch (error) {
                console.error(error);
                setErr('Ошибка на сервере');
              }
        }
    }
  }

  function cancelPay() {
    navigate('/корзина')
  }

  return (
    <div className='Payment'>
      <button onClick={cancelPay} className='cancelPay'>Отмена</button>
      <h2>ОПЛАТА</h2>
      <div className='order-info'>
      <nav className='pay-nav' style={{fontSize: '20px'}}>Выберите способ оплаты:</nav>
          <label className='choice'>
            <input
              type="checkbox"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={handlePaymentMethodChange}
            />
            <span></span><nav>Оплата платежной картой на сайте</nav>
          </label>

          <div style={{ display: paymentMethod === 'card' ? 'block' : 'none' }}>
              <input value={number} onChange={(e) => setNumber(e.target.value)} className='pay-input' placeholder='Номер карты' />
              <input value={date} onChange={(e) => setDate(e.target.value)} className='pay-input' placeholder='Срок действия карты' />
              <input value={code} onChange={(e) => setCode(e.target.value)} className='pay-input' placeholder='Код CCV2' />
          </div>

          <label className='choice'>
            <input
              type="checkbox"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={handlePaymentMethodChange}
            />
            <span></span><nav>Оплата при получении</nav>
          </label>

          <nav className='pay-nav'>Доставка</nav>
          <input value={adress} onChange={(e) => setAdress(e.target.value)} className='pay-input' placeholder='Улица/Дом/Квартира' />

          <nav className='err'>{err}</nav>

          <button onClick={Continue}>Купить</button>
      </div>
    </div>
  )
}
