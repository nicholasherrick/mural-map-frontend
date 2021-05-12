const mongoose = require('mongoose');
const User = require('./User');
const Mural = require('./Mural');

mongoose.connect(process.env.MONGODB_URI, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('debug', true);

module.exports = { User, Mural };
