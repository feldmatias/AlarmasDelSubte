import {buildSchema} from "type-graphql";
import {Config} from "../../config/config";
import {Container} from "typedi";
import {GraphQLSchema} from "graphql";
import {LoginRequiredMiddleware} from "../http/middlewares/LoginRequiredMiddleware";

export class GraphQL {

    static async createSchema(): Promise<GraphQLSchema> {
        return await buildSchema({
            resolvers: [process.cwd() + Config.src.folder + "/src/**/resolvers/**/*" + Config.src.fileExtension],
            emitSchemaFile: __dirname + "/schema.graphql",
            container: Container,
            validate: false,
            globalMiddlewares: [LoginRequiredMiddleware],
        });
    }
}