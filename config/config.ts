import config from 'config';

interface Config {
    db: DbConfig
    src: SrcConfig
    subways: Subways
}

interface DbConfig {
    type: string
    name: string
}

interface SrcConfig {
    fileExtension: string
    folder: string
}

interface Subways {
    realTimeUrl: string;
}

const appConfig = config.get('config') as Config;
export {appConfig as Config}