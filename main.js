const connectDb = require('./config/connection')
const dotenv = require('dotenv');
const express = require('express');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const systemRoute = require('./routes/systemRoute');
const orderRoute = require('./routes/orderRoute')
const path = require('path');
const { socketServer, io } = require('./config/socketConfig');
const {swaggerUi, swaggerSpec} = require('./swagger');

const app = express();
const port = 8000;
dotenv.config()
connectDb()
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(express.json())
app.use('/user', userRoute)
app.use('/category', categoryRoute)
app.use('/product', productRoute)
app.use('/common', systemRoute)
app.use('/order', orderRoute)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

socketServer()

io.on("connection", (socket) => {
  io.emit('!!Socket connected successfully!!')

  socket.on("message", (data) => {
    io.emit('message', 'Hi Gulshan')
  });

  // Handle disconnection
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});