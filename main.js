const connectDb = require('./db/connection')
const dotenv = require('dotenv');
const express = require('express');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const app = express();
const port = 3000;
dotenv.config()
connectDb()

app.use(express.json())
app.use('/user', userRoute)
app.use('/category', categoryRoute)
app.use('/product', productRoute)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});