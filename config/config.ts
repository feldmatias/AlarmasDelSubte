import config from 'config';
import {DatabaseType} from "typeorm/driver/types/DatabaseType";

interface Config {
    db: DbConfig
    src: SrcConfig
}

interface DbConfig {
    type: DatabaseType
    name: string
}

interface SrcConfig {
    fileExtension: string
}

const appConfig = config.get('config') as Config;
export {appConfig as Config}