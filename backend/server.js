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

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
