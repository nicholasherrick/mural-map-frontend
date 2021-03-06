require('dotenv').config();
const express = require('express');
const next = require('next');
const cors = require('cors');
const sslRedirect = require('heroku-ssl-redirect').default;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const os = require('os');
const db = require('./models');
const errorHandler = require('./middleware/error');

const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // Use https in production
    server.use(sslRedirect());

    const showRoutes = require('./routes/index.js');

    server.use(cors());
    server.use(cookieParser());
    server.use(bodyParser.json());

    server.use('/api', showRoutes(server));

    server.use(errorHandler);

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Ready on ${PORT}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
