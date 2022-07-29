const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors());

app.use('/users', require('./src/routes/api/users'));
app.use('/auth', require('./src/routes/api/auth'));

app.get('/', (req, res) => {
  res.send('account_mfe: server up and running...');
});

connectDB();

app.listen(port, () => {
  console.log(`account_mfe: Server startet on port ${port}`);
});
