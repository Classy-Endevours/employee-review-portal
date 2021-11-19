import * as http from 'http';
import app from './app';
import config from './config';
import { initData } from './mock/initData';

const PORT: number = config.app.port;

// listening the server once the mock data is created.
// To make sure the api responses with the mock data on first call itself
initData()
  .then(res => {
    // use environment set PORT or custom port. Signifacant in heroku deploy
    http.createServer(app).listen(process.env.PORT || PORT, () => {
      console.log('Express server listening on port ' + PORT);
    });
  })
  .catch(err => console.error(err));
