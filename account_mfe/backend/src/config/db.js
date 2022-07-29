const mongoose = require('mongoose');
const DB_URI =
  'mongodb+srv://birgitterl:account_mfe_birgitterl@cluster0.3op3k.mongodb.net/?retryWrites=true&w=majority';

var options = {
  useNewUrlParser: true,
};

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, options);
    console.log('account_mfe: MongoDB successfully connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
