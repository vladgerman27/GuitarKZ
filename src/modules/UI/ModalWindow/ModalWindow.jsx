import './ModalWindow.css'

import React, { useState, useEffect } from 'react'
import Modal from 'react-modal';

export default function ModalWindow({guitar}) {
  const [guitars, setGuitars] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/guitars')
      .then(res => res.json())
      .then(data => setGuitars(data))
      .catch(error => console.log(error));
  }, []);
  
  return (
    <div>
      <button className='more' onClick={() => setModalIsOpen(true)}>Подробнее&raquo;</button>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className='ModalWindow'>
        <img className='ModalImg' src={require(`../../img/guitars/${guitar.img}.png`)} />
        <button className='cross' onClick={() => setModalIsOpen(false)}>X</button>
        <div className='ModalInfo'>
          <h2>{guitar.name}</h2>
          <nav><h4>Цeна:</h4>{guitar.cost}тг</nav>
          <nav><h4>В наличие:</h4>{guitar.amount}шт</nav>
          <nav><h4>Бренд:</h4>{guitar.brand}</nav>
          <nav><h4>Тип:</h4>{guitar.type}</nav>
          <nav><h4>Описание:</h4>{guitar.description}</nav>
        </div>
      </Modal>
    </div>
  )
}

