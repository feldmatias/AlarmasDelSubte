import config from 'config';

interface Config {
    db: DbConfig
    src: SrcConfig
    graphql: GraphqlConfig
}

interface DbConfig {
    type: string
    name: string
}

interface SrcConfig {
    fileExtension: string
}

interface GraphqlConfig {
    graphiql: boolean
}

const appConfig = config.get('config') as Config;
export {appConfig as Config}