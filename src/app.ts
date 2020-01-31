import "reflect-metadata";
import express from 'express';
import {Db} from "./db/Db";
import graphqlHTTP from "express-graphql";
import {GraphQL} from "./graphql/GraphQL";
import {registerCommandRoutes} from "./commands/routes";
import morgan from "morgan";

// Create a new express application instance
const app: express.Application = express();

app.use(express.json());
morgan.token('body', (req, _res) => {
    return JSON.stringify(req.body);
});
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));


const bootstrap: () => Promise<void> = async () => {
    // Db
    await Db.create();

    // GraphQL
    const schema = await GraphQL.createSchema();
    app.use('/graphql',
        graphqlHTTP({
            schema: schema,
            graphiql: false,
            customFormatErrorFn: error => error.message
        }),
    );

    registerCommandRoutes(app);

    app.listen(3000, function () {
        console.log('App listening on port 3000');
    });
};

bootstrap();
