const express = require('express'); /* On importe express */
const path = require('path');

const productRoutes = require('./routes/product');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

/* const relativePath = 'index.html';
console.log('Relative Path to index.html:', relativePath);

app.get('/', (req, res) => {
  res.sendFile(relativePath, { root: process.cwd() });
});

const cartPath = 'cart.html';
console.log('Relative Path to cart.html:', cartPath);

app.get('/cart.html', (req, res) => {
  res.sendFile(cartPath, { root: process.cwd() });
}); */

app.use(express.static('static'));

app.use('/api/products', productRoutes);

module.exports = app;
