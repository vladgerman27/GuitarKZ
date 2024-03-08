const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../src/modules/img/guitars/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

require('dotenv').config();

const app = express();

const port = 8080;
const dbUri = "mongodb+srv://<user>:<password>@cluster.66iafdi.mongodb.net/";

app.use(cors());
app.use(express.json());

app.get('/guitars', async (req, res) => {
  const client = await MongoClient.connect(dbUri);
  const db = client.db('GuitarKZ');
  const guitars = db.collection('Guitars');

  const data = await guitars.find({}).toArray();

  res.json(data);
});

app.post('/guitars', upload.single("img"), async (req, res) => {
  const { name, description, cost, amount, type, brand, popular: isPopular } = req.body;
  const img = req.file.filename;

  const imageName = img.split(".")[0];

  const client = await MongoClient.connect(dbUri);
  const db = client.db('GuitarKZ');
  const guitars = db.collection('Guitars');

  const result = await guitars.insertOne({ img: imageName, name, description, cost: parseInt(cost), amount: parseInt(amount), type, brand, new: Boolean(true), popular: Boolean(isPopular) });
});

app.put('/guitars/:id', upload.single('img'), async (req, res) => {
  try {
    const { name, description, cost, amount, type, brand, new: isNew, popular: isPopular } = req.body;
    const img = req.file ? req.file.filename : undefined;

    const client = await MongoClient.connect(dbUri);
    const db = client.db('GuitarKZ');
    const guitars = db.collection('Guitars');

    const guitarId = req.params.id;

    const updateFields = {
      name,
      description,
      cost: parseFloat(cost),
      amount: parseInt(amount),
      type,
      brand,
      new: Boolean(isNew),
      popular: Boolean(isPopular),
    };

    if (img) {
      updateFields.img = img.split('.')[0];
    }

    const result = await guitars.updateOne(
      { _id: new ObjectId(guitarId) },
      {
        $set: updateFields,
      }
    );

    client.close();

    res.status(200).json({ success: true, message: 'Guitar updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.delete('/guitars/:id', async (req, res) => {
  const guitarId = req.params.id;

  const client = await MongoClient.connect(dbUri);
  const db = client.db('GuitarKZ');
  const guitars = db.collection('Guitars');

  await guitars.deleteOne({ _id: new ObjectId(guitarId) });

  res.json({ success: true });
});




app.post('/login_user', async (req, res) => {
    const { email, password} = req.body;

    try {
      const client = await MongoClient.connect(dbUri);
      const db = client.db('GuitarKZ');
      const users = db.collection('Users');

      const user = await users.findOne({ email });  

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = user.password === password;

      if (!passwordMatch) {
          return res.status(402).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ _id: user._id, email: user.email, name: user.name, phone: user.phone, basket: user.basket, favorites: user.favorites }, "token");

      res.json({ token, name: user.name, phone: user.phone });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/login_admin', async (req, res) => {
    const { email, password} = req.body;

    try {
      const client = await MongoClient.connect(dbUri);
      
      const db = client.db('GuitarKZ');
      const admins = db.collection('Admins');

      const admin = await admins.findOne({ email });

      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const passwordMatch = admin.password === password;

      if (!passwordMatch) {
          return res.status(402).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ _id: admin._id, email: admin.email, name: admin.name, phone: admin.phone }, "token");

      res.json({ token, name: admin.name, phone: admin.phone });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/register_user', async (req, res) => {
    const { email, password, name, phone } = req.body;
  
    const client = await MongoClient.connect(dbUri);
    const db = client.db('GuitarKZ');
    const users = db.collection('Users');
  
    const existingUser = await users.findOne({ email });
  
    if (existingUser) {
      return res.status(401).json({ error: 'User already exists' });
    }
  
    const result = await users.insertOne({ email, password, name, phone, basket: [], favorites: [] });
  
    const token = jwt.sign({ _id: result.insertedId, email, name, phone, basket: [], favorites: [] }, "token");
  
    res.json({ token });
  });

  app.post('/register_admin', async (req, res) => {
    const { email, password, name, phone } = req.body;
  
    const client = await MongoClient.connect(dbUri);
    const db = client.db('GuitarKZ');
    const admins = db.collection('Admins');
  
    const existingAdmin = await admins.findOne({ email });
  
    if (existingAdmin) {
      return res.status(401).json({ error: 'User already exists' });
    }
  
    const result = await admins.insertOne({ email, password, name, phone });
  
    const token = jwt.sign({ _id: result.insertedId, email, name, phone }, "token")
  
    res.json({ token });
  });

  function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Необходимо авторизоваться' });
    }
    
    try {
      const decodedToken = jwt.verify(token, 'token');
      req.userId = decodedToken._id;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Неверный токен' });
    }
  }




  app.get('/basket', verifyToken, async (req, res) => {
    const userId = req.userId;
    
    try {
      const client = await MongoClient.connect(dbUri);
      const db = client.db('GuitarKZ');
      const users = db.collection('Users');
      const user = await users.findOne({ _id: new ObjectId(userId) });
      
      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден' });
      } else {
        res.json(user.basket);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/basket', verifyToken, async (req, res) => {
    const guitarId = req.body.guitarId;
    const guitarImg = req.body.guitarImg;
    const guitarName = req.body.guitarName;
    const guitarAmount = req.body.guitarAmount;
    const guitarCost = req.body.guitarCost;
    const guitarCount = 1;
    const userId = req.userId;
    
    try {
    const client = await MongoClient.connect(dbUri);
    const db = client.db('GuitarKZ');
    const users = db.collection('Users');
    const basketCopy = db.collection('Basket');
    await users.updateOne({ _id: new ObjectId(userId) }, { $push: { basket: {guitarId, guitarImg, guitarName, guitarAmount, guitarCost, guitarCount} }});
    await basketCopy.insertOne({ user_id: userId, guitar_id: guitarId})
    
    res.json({ message: 'Товар успешно добавлен в корзину' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.put('/basket/:guitarId', verifyToken, async (req, res) => {
    const guitarId = req.params.guitarId;
    const userId = req.userId;
    const action = req.body.action;
  
    try {
      const client = await MongoClient.connect(dbUri);
      const db = client.db('GuitarKZ');
      const users = db.collection('Users');
      const user = await users.findOne({ _id: new ObjectId(userId) });
      const basket = user.basket;
      const guitar = basket.find((guitar) => guitar.guitarId === guitarId);
  
      if (action === 'plus') {
        if (guitar.guitarCount < guitar.guitarAmount) {
          await users.updateOne(
            { _id: new ObjectId(userId), 'basket.guitarId': guitarId },
            { $inc: { 'basket.$.guitarCount': 1 } }
          );
          res.json({ message: 'Количество товара успешно увеличено' });
        } else {
          res.status(400).json({ error: 'Недостаточно товара на складе' });
        }
      } else if (action === 'minus') {
        if (guitar.guitarCount > 1) {
          await users.updateOne(
            { _id: new ObjectId(userId), 'basket.guitarId': guitarId },
            { $inc: { 'basket.$.guitarCount': -1 } }
          );
          res.json({ message: 'Количество товара успешно уменьшено' });
        } else {
          res.json({ message: 'Количество товара уже равно 1' });
        }
      } else {
        res.status(400).json({ error: 'Неверный запрос' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/basket/delete', verifyToken, async (req, res) => {
    const userId = req.userId;
    const guitarId = req.body.guitarId;
  
    try {
      const client = await MongoClient.connect(dbUri);
      const db = client.db('GuitarKZ');
      const users = db.collection('Users');
      const basketCopy = db.collection('Basket');

      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { basket: { guitarId: guitarId } } }
      );

      await basketCopy.deleteOne({ user_id: userId, guitar_id: guitarId });
  
      res.json({ message: 'Товар успешно удален из корзины' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.patch('/basket/delete', verifyToken, async (req, res) => {
    const userId = req.userId;
  
    try {
      const client = await MongoClient.connect(dbUri);
      const db = client.db('GuitarKZ');
      const users = db.collection('Users');
      const guitars = db.collection('Guitars');
      const basketCopy = db.collection('Basket');
  
      const user = await users.findOne({ _id: new ObjectId(userId) });
      const basket = user.basket;

      await basketCopy.deleteMany({ user_id: userId });
  
      for (const item of basket) {
        const guitarId = item.guitarId;
        const guitarCount = item.guitarCount;
      
        const guitar = await guitars.findOne({ _id: new ObjectId(guitarId) });
        const result = await guitars.updateOne(
          { _id: new ObjectId(guitarId) },
          { $inc: { amount: -guitarCount } }
        ).catch(error => console.error(error));
        
        if (result.modifiedCount !== 1) {
          console.log(`Modified count: ${result.modifiedCount}`);
        }
      }
  
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { basket: [] } }
      );
  
      res.json({ message: 'Корзина пользователя успешно очищена' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



  app.get('/favorites', verifyToken, async (req, res) => {
    const userId = req.userId;
    
    try {
      const client = await MongoClient.connect(dbUri);
      const db = client.db('GuitarKZ');
      const users = db.collection('Users');
      const user = await users.findOne({ _id: new ObjectId(userId) });
      
      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден' });
      } else {
        res.json(user.favorites);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/favorites', verifyToken, async (req, res) => {
    const guitarId = req.body.guitarId;
    const guitarImg = req.body.guitarImg;
    const guitarName = req.body.guitarName;
    const guitarAmount = req.body.guitarAmount;
    const guitarCost = req.body.guitarCost;
    const userId = req.userId;
    
    try {
    const client = await MongoClient.connect(dbUri);
    const db = client.db('GuitarKZ');
    const users = db.collection('Users');
    const favoritesCopy = db.collection('Favorites')
    await users.updateOne({ _id: new ObjectId(userId) }, { $push: { favorites: {guitarId, guitarImg, guitarName, guitarAmount, guitarCost,} }});

    await favoritesCopy.insertOne({user_id: userId, guitar_id: guitarId})
    
    res.json({ message: 'ТОвар успешно добавлен в избранное' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/favorites/delete', verifyToken, async (req, res) => {
    const userId = req.userId;
    const guitarId = req.body.guitarId;
  
    try {
      const client = await MongoClient.connect(dbUri);
      const db = client.db('GuitarKZ');
      const users = db.collection('Users');
      const favoritesCopy = db.collection('Favorites')
      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { favorites: { guitarId: guitarId } } }
      );

      await favoritesCopy.deleteOne({ user_id: userId, guitar_id: guitarId})
  
      res.json({ message: 'Товар успешно удален из избранное' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.patch('/favorites/delete', verifyToken, async (req, res) => {
    const userId = req.userId;
  
    try {
      const client = await MongoClient.connect(dbUri);
      const db = client.db('GuitarKZ');
      const users = db.collection('Users');
      const favoritesCopy = db.collection('Favorites')
      const result = await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { favorites: [] } }
      );

      await favoritesCopy.deleteMany({ user_id: userId})
  
      if (result.modifiedCount === 0) {
        res.status(404).json({ message: 'Пользователь не найден' });
      } else {
        res.json({ message: 'Избранное пользователя успешно очищена' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });




  app.get('/shops', async (req, res) => {
    const client = await MongoClient.connect(dbUri);
    const db = client.db('GuitarKZ');
    const guitars = db.collection('Shops');
  
    const data = await guitars.find({}).toArray();
  
    res.json(data);
  });

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));