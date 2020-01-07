import config from 'config';

interface Config {
    db: DbConfig
    src: SrcConfig
}

interface DbConfig {
    type: string
    name: string
}

interface SrcConfig {
    fileExtension: string
}

const appConfig = config.get('config') as Config;
export {appConfig as Config}