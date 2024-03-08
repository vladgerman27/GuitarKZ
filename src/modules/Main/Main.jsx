import './Main.css'

import Header from '../UI/Header/Header';
import BasketBtn from '../UI/Buttons/BasketBtn';
import FavoriteBtn from '../UI/Buttons/FavoriteBtn';
import ModalWindow from '../UI/ModalWindow/ModalWindow';

import React, {useState, useEffect, useRef} from 'react'
import { useSnapCarousel } from 'react-snap-carousel'
import { NavLink } from 'react-router-dom'

import Companies from '../img/companies.png'
import Comp1 from '../img/comp1.png'
import Comp2 from '../img/comp2.png'
import Comp3 from '../img/comp3.png'

export default function Main() {
  const [guitars, setGuitars] = useState([])

  let err = 'Нет в наличие'
  let unerr = ''

  useEffect(() => {
    fetch('http://localhost:8080/guitars')
      .then(res => res.json())
      .then(data => setGuitars(data))
      .catch(error => console.log(error));
  }, []);

  const newGuitarsRef = useRef(null);
  const bestGuitarsRef = useRef(null);

  const { scrollRef: newGuitarsScrollRef, pages: newGuitarsPages, activePageIndex: newGuitarsActivePageIndex, next: newGuitarsNext, prev: newGuitarsPrev, 
    goTo: newGuitarsGoTo } =
      useSnapCarousel({ ref: newGuitarsRef });

  const { scrollRef: bestGuitarsScrollRef, pages: bestGuitarsPages, activePageIndex: bestGuitarsActivePageIndex, next: bestGuitarsNext, prev: bestGuitarsPrev, 
    goTo: bestGuitarsGoTo } =
      useSnapCarousel({ ref: bestGuitarsRef });
  
  return (
    <div>
      <Header/>
      <div className='Main'>
        <div className='sliders'>
          <div className='slider'>
            <nav className='slider-title'>НОВИНКИ</nav>
            <div className='category-slider'>
              <button className='slider-tick' onClick={() => newGuitarsPrev()}>&#8249;</button>
              <ul
                ref={newGuitarsScrollRef}
                style={{
                  display: 'flex',
                  overflow: 'auto',
                  scrollSnapType: 'x mandatory'
                }}
              >
                {guitars.filter(guitar => guitar.new === true).map((guitar) => (
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
              <button className='slider-tick' onClick={() => newGuitarsNext()}>&#8250;</button>
            </div>
            <div className='movements'>
              <ol style={{ display: 'flex' }}>
                {newGuitarsPages.map((_, i) => (
                    <button className='slider-button'
                      style={i === newGuitarsActivePageIndex ? { backgroundColor: '#909090 ' } : {}}
                      onClick={() => newGuitarsGoTo(i)}
                    >
                    </button>
                ))}
              </ol>
              <div className='slider-tick'>
              </div>
            </div>
          </div>

          <div className='slider'>
            <nav className='slider-title'>ПОПУЛЯРНОЕ</nav>
            <div className='category-slider'>
              <button className='slider-tick' onClick={() => bestGuitarsPrev()}>&#8249;</button>
              <ul
                ref={bestGuitarsScrollRef}
                style={{
                  display: 'flex',
                  overflow: 'auto',
                  scrollSnapType: 'x mandatory'
                }}
              >
                {guitars.filter(guitar => guitar.popular === true).map((guitar) => (
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
              <button className='slider-tick' onClick={() => bestGuitarsNext()}>&#8250;</button>
            </div>
            <div className='movements'>
              <ol style={{ display: 'flex' }}>
                {bestGuitarsPages.map((_, i) => (
                    <button className='slider-button'
                      style={i === bestGuitarsActivePageIndex ? { backgroundColor: '#909090 ' } : {}}
                      onClick={() => bestGuitarsGoTo(i)}
                    >
                    </button>
                ))}
              </ol>
              <div className='slider-tick'>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className='blocks-links'>
        <label><div className='block-link' id='electric'><NavLink to='/электрогитары'><a>Электрогитары</a></NavLink></div></label>
        <label><div className='block-link' id='acustic'><NavLink to='/акустические_гитары'><a>Акустические гитары</a></NavLink></div></label>
        <label><div className='block-link' id='classic'><NavLink to='/классические_гитары'><a>Классические гитары</a></NavLink></div></label>
        <label><div className='block-link' id='bass'><NavLink to='/басс-гитары'><a>Басс-гитары</a></NavLink></div></label>
        <label><div className='block-link' id='combo'><NavLink to='/усилители'><a>Усилители</a></NavLink></div></label>
        <label><div className='block-link' id='acessuary'><NavLink to='/аксессуары'><a>Аксессуары</a></NavLink></div></label>
      </div>

      <div className="kakhochesh">

        <div className="text">
          <span className='header'> У нас </span> 
          <span className='header1'> лучшие бренды</span>
        </div>
        
        <img src={Companies} />

      </div>
      
      <div className="kaktotak">

        <div className="Rhytm">
          <span className='text1'> Почему </span> 
          <span className='text2'> Guitar.kz? </span>
        </div>
        
        <div className="imgcomp">
          <div className="imgcomp1">
            <img src={Comp1} />
            <span> Плавный просмотр </span>
            <label> Приятный, просто и удобный диззайн, который легко поможет вам найти то, что нужно. </label>
          </div>

          <div className="imgcomp1">
            <img src={Comp2} />
            <span> ПРОСТАЯ доставка </span>
            <label> Достаточно просто ввести свой адресс. </label>
          </div>
          
          <div className="imgcomp1">
            <img src={Comp3} />
            <span> Удобные ПЛАТЕЖИ </span>
            <label> Надёжные платежи со 100% гарантией. </label>
          </div>
        </div>
      </div>
    </div>

  )
}