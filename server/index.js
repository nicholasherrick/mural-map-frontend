require('dotenv').config();
const express = require('express');
const next = require('next');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const formData = require('express-form-data');
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
    const showRoutes = require('./routes/index.js');

    server.use(cors());
    server.use(cookieParser());
    server.use(bodyParser.json());
    // parse data with connect-multiparty.
    // server.use(
    //   formData.parse({
    //     uploadDir: os.tmpdir(),
    //     autoClean: false,
    //   })
    // );
    // // delete from the request all empty files (size == 0)
    // server.use(formData.format());
    // // change the file objects to fs.ReadStream
    // server.use(formData.stream());
    // // union the body and the files
    // server.use(formData.union());

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
