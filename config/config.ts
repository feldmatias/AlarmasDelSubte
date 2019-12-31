import config from 'config';

interface Config {
    db: DbConfig
}

interface DbConfig {
    name: string
}

const appConfig = config.get('config') as Config
export {appConfig as Config}