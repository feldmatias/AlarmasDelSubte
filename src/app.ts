import "reflect-metadata";
import express from 'express';
import {Db} from "./db/Db";


// Create a new express application instance
const app: express.Application = express();


app.get('/', function (req, res) {
    res.send('Hello World!');
});

const bootstrap = async () => {
    await Db.create();

    app.listen(3000, function () {
        console.log('App listening on port 3000!');
    });
}

bootstrap();
