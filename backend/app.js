const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
var helmet = require('helmet');


const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce')

const app = express();
//app.use(helmet())

mongoose.connect('mongodb+srv://Admin:AdminBdd56@bddpiiquante.dzozu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

// Traitement des requêtes vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')));
// Traitement des requêtes vers la route /api/auth
app.use('/api/auth', userRoutes);
// Traitement des requêtes vers la route /api/sauces
app.use('/api/sauces', saucesRoutes);

module.exports = app;
