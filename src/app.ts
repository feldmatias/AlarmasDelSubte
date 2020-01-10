import "reflect-metadata";
import express from 'express';
import {Db} from "./db/Db";
import graphqlHTTP from "express-graphql";
import {GraphQL} from "./graphql/GraphQL";


// Create a new express application instance
const app: express.Application = express();

const bootstrap: () => Promise<void> = async () => {
    // Db
    await Db.create();

    // GraphQL
    const schema = await GraphQL.createSchema();
    app.use('/graphql',
        graphqlHTTP({
            schema: schema,
            graphiql: false,
            customFormatErrorFn: (error) => {
                return error.message
            }
        }),
    );

    app.listen(3000, function () {
        console.log('App listening on port 3000!');
    });
};

bootstrap();
