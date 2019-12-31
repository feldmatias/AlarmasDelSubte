import express from 'express';
import {Config} from '../config/config'


// Create a new express application instance
const app: express.Application = express();


app.get('/', function (req, res) {
    res.send('Hello World!');
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    console.log(process.env.NODE_ENV);
    console.log(Config.db.name);
});
