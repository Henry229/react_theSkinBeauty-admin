import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoute from './routes/customer-route.js';
import categoryRoute from './routes/category-route.js';
import serviceRoute from './routes/service-route.js';
import bookRoute from './routes/book-route.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(customerRoute);
app.use(categoryRoute);
app.use(serviceRoute);
app.use(bookRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// const mysql = require('mysql');
// const cors = require('cors');

// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'your_username',
//   password: 'your_password',
//   database: 'your_database_name',
// });

// app.post('/add-customer', (req, res) => {
//   const { firstName, lastName, mobile, email } = req.body;
//   const query =
//     'INSERT INTO customers (firstName, lastName, mobile, email) VALUES (?, ?, ?, ?)';

//   db.query(query, [firstName, lastName, mobile, email], (err, result) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error while inserting customer data');
//     } else {
//       res.status(201).send('Customer added successfully');
//     }
//   });
// });

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
