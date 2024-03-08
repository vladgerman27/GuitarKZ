import './Pages.css'

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import BasketBtn from '../UI/Buttons/BasketBtn';
import FavoriteBtn from '../UI/Buttons/FavoriteBtn';
import Header from '../UI/Header/Header';
import ModalWindow from '../UI/ModalWindow/ModalWindow';

const Pages = ({ guitars }) => {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category.replace(/-/g, ''));
  const [sortBy, setSortBy] = useState('default'); 
  const [searchTerm, setSearchTerm] = useState('');

  let err = 'Нет в наличие'
  let unerr = ''

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const sortAndFilterGuitars = (guitars) => {
    let filteredGuitars = guitars.filter((guitar) => guitar.type === decodedCategory);

    if (searchTerm) {
      filteredGuitars = filteredGuitars.filter((guitar) =>
        guitar.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'ascending':
        return [...filteredGuitars].sort((a, b) => a.cost - b.cost);
      case 'descending':
        return [...filteredGuitars].sort((a, b) => b.cost - a.cost);
      default:
        return filteredGuitars;
    }
  };

  const sortedAndFilteredGuitars = sortAndFilterGuitars(guitars);

  return (
    <div className='Page'>
      <Header/>
      <h2>{decodedCategory}</h2>
      <div className='sort-cost'>
        <label htmlFor="sort">Сортировка по цене:</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="default">По умолчанию</option>
          <option value="ascending">По возрастанию</option>
          <option value="descending">По убыванию</option>
        </select>
      </div>
      <div className='searchGuitar'>
        <label htmlFor="search">Поиск по названию:</label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Введите название"
        />
      </div>
      <ul className='categories'>
        {sortedAndFilteredGuitars.map((guitar) => (
          <div key={guitar._id} className='guitar'>
            <img src={require(`../img/guitars/${guitar.img}.png`)} />
            <nav><b>{guitar.name}</b></nav>
            <span>{guitar.cost}тг</span>
            <span className='errAmount'>{guitar.amount === 0 ? err : unerr}</span>
            <div className='buttons'>
              <BasketBtn guitar={guitar} />
              <FavoriteBtn guitar={guitar} />
              <ModalWindow guitar={guitar}/>
            </div>
        </div>
        ))}
      </ul>
    </div>
  );
};

export default Pages;