import './Menu.css'

import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Menu() {
  const [account, setAccount] = useState(false)
  const [guitars, setGuitars] = useState([])

  const [img, setImage] = useState(null);
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('')
  const [brand, setBrand] = useState('')
  const [isNew, setIsNew] = useState(false);
  const [isPopular, setIsPopular] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:8080/guitars')
      .then(res => res.json())
      .then(data => setGuitars(data))
      .catch(error => console.log(error));
  }, []);

  const imageChange = (event) => {
    const file = event.target.files[0];
    setImage(file); 
  };

  const createGuitar = async (e) => {
    e.preventDefault();
    if (name === "" || img == null || description === "" || cost === "" || amount === "" || type === ""|| brand === "" ) {
      // setSingupMis("Пропущено поле. Повторите ввод.")
    } else {
      try {
        const formData = new FormData();
        formData.append("img", img);
        formData.append("name", name);
        formData.append("description", description);
        formData.append("cost", cost);
        formData.append("amount", amount);
        formData.append("type", type);
        formData.append("brand", brand);
        formData.append("popular", isPopular);
  
        const response = await axios.post('http://localhost:8080/guitars', formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });

        window.location.reload();

        setImage(null);
        setName('');
        setDescription('');
        setCost('');
        setAmount('');
        setType('');
        setBrand('');
        setIsPopular(false);
      } catch (error) {
        console.error(error);
        setImage(null);
        setName('');
        setDescription('');
        setCost('');
        setAmount('');
        setType('');
        setBrand('');
        setIsPopular(false);
      }
    }
  }; 
  
  const [editingGuitarId, setEditingGuitarId] = useState(null);
  const [editedGuitarImg, setEditedGuitarImg] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const imageChangeId = (event, guitarId) => {
    const file = event.target.files[0];
    
    setEditedGuitarImg((prevImages) => ({
      ...prevImages,
      [guitarId]: file,
    }));
  };

  const filteredGuitars = guitars.filter((guitar) => {
    return (
      guitar.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
  });

  const editGuitar = async (guitarId) => {
    setEditingGuitarId(guitarId);
    imageChangeId({ target: { files: [] } }, guitarId);
  };

  const updateGuitar = async (guitarId) => {
    try {
      const updatedGuitar = {
        img: editedGuitarImg[guitarId], 
        name,
        description,
        cost: parseFloat(cost),
        amount: parseInt(amount),
        type,
        brand,
        new: isNew,
        popular: isPopular,
      };

      await axios.put(`http://localhost:8080/guitars/${guitarId}`, updatedGuitar);

      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setImage(null)
    setName('');
    setDescription('');
    setCost('');
    setAmount('');
    setType('');
    setBrand('');
    setIsNew(false);
    setIsPopular(false);
    setEditingGuitarId(null);
  };

  const deleteGuitar = async (guitarId) => {
    try {
      await axios.delete(`http://localhost:8080/guitars/${guitarId}`);

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const Logout = () => {
    localStorage.removeItem('isAuth');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    setAccount(false);
    navigate('/')
  };

  return (
    <div className='Menu'>
      <button onClick={Logout} className='exitBtn'>Выйти</button>
      <div className='addGuitar'>
        <h1>Добавить товар</h1>
        <div className='addGuitar-form'>
          <input className='changeImage' type='file' onChange={imageChange} accept="image/*"/>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Название'/>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Описание'/>
          <input value={cost} onChange={(e) => setCost(e.target.value)} placeholder='Цена'/>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Количество'/>
          <input value={type} onChange={(e) => setType(e.target.value)} placeholder='Тип'/>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder='Бренд'/>
          <label className='checkParams'>
            Популярное:
            <input type="checkbox" checked={isPopular} onChange={() => setIsPopular(!isPopular)} />
          </label>
          <button onClick={createGuitar}>Добавить</button>
        </div>
      </div>
        
      <div className='infoChange'>
      <h1 className='infoGuitars'>Информция о товарах</h1>
      <div className='searchAdmin'>
        <label htmlFor="search">Поиск по названию:</label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Введите название"
        />
      </div>
        
        <div className='cards'>
        {filteredGuitars.map((guitar) => (
          <div className='adminCard' key={guitar._id}>
            {editingGuitarId === guitar._id ? (
              <div>
                <input type="file" onChange={imageChange} accept="image/*" />
                <img src={img ? URL.createObjectURL(img) : require(`../../img/guitars/${guitar.img}.png`)} alt={guitar.name} />
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" />
                <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание" />
                <input value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Цена" />
                <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Количество" />
                <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Тип" />
                <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Бренд" />
                <label>
                  New:
                  <input type="checkbox" checked={isNew} onChange={() => setIsNew(!isNew)} />
                </label>
                <label>
                  Popular:
                  <input type="checkbox" checked={isPopular} onChange={() => setIsPopular(!isPopular)} />
                </label>
                <button onClick={() => updateGuitar(guitar._id)}>Сохранить</button>
                <button onClick={resetForm}>Отменить</button>
              </div>
            ) : (
              <div>
                <img src={require(`../../img/guitars/${guitar.img}.png`)} alt={guitar.name} />
                <nav>Название: {guitar.name}</nav>
                <nav>Описание: {guitar.description}</nav>
                <nav>Цена: {guitar.cost}</nav>
                <nav>Количество на складе: {guitar.amount}</nav>
                <nav>Тип товара: {guitar.type}</nav>
                <nav>Название бренда: {guitar.brand}</nav>
                <div>{guitar.new ? 'Новый товар' : 'Не новый'}</div>
                <div>{guitar.popular ? 'Популярный товар' : 'Не популярный'}</div>
                <button onClick={() => editGuitar(guitar._id)}>Изменить</button>
                <button onClick={() => deleteGuitar(guitar._id)}>Удалить</button>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}
