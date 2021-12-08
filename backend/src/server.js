require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');

const hostname = 'localhost';
const port = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());

// Setup routes
import routes from './routes';
app.use('/api', routes);

// Serve up the frontend's "build" directory, if we're running in production mode.
if (process.env.NODE_ENV === 'production') {
  console.log('Running in production!');

  // Make all files in that folder public
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  // If we get any GET request we can't process using one of the server routes, serve up index.html by default.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
  });
}

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
