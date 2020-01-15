import {buildSchema, registerEnumType} from "type-graphql";
import {Config} from "../../config/config";
import {Container} from "typedi";
import {GraphQLSchema} from "graphql";
import {LoginRequiredMiddleware} from "./middlewares/LoginRequiredMiddleware";
import {SubwayStatus} from "../subways/SubwayStatus";

export class GraphQL {

    static async createSchema(): Promise<GraphQLSchema> {

        registerEnumType(SubwayStatus, {
            name: "SubwayStatus"
        });

        return await buildSchema({
            resolvers: [process.cwd() + Config.src.folder + "/src/**/resolvers/**/*" + Config.src.fileExtension],
            emitSchemaFile: __dirname + "/schema.graphql",
            container: Container,
            validate: false,
            globalMiddlewares: [LoginRequiredMiddleware],
        });
    }
}