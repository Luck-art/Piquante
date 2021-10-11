const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const { fileURLToPath } = require('url');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://userNormal:SkyClearOP1519@cluster0.nravs.mongodb.net/Projet-6?retryWrites=true&w=majority',
  { useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

mongoose.connect('mongodb+srv://userAdmin:TurtleOp1643@cluster0.nravs.mongodb.net/Projet-6?retryWrites=true&w=majority',
{ useNewUrlParser: true, 
  useCreateIndex: true, 
  useUnifiedTopology: true, 
  useFindAndModify: true})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

console.log(mongoose);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;