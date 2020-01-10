import {buildSchema} from "type-graphql";
import {Config} from "../../config/config";
import {Container} from "typedi";
import {GraphQLSchema} from "graphql";

export class GraphQL {

    static async createSchema(): Promise<GraphQLSchema> {
        return await buildSchema({
            resolvers: [process.cwd() + "/src/**/resolvers/**/*" + Config.src.fileExtension],
            emitSchemaFile: __dirname + "/schema.gql",
            container: Container,
        });
    }
}