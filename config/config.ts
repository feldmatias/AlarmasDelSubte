import config from 'config';

interface Config {
    db: DbConfig
    src: SrcConfig
    subways: SubwaysConfig
    alarms: AlarmsConfig
    notifications: NotificationsConfig
}

interface DbConfig {
    type: string
    name: string
}

interface SrcConfig {
    fileExtension: string
    folder: string
}

interface SubwaysConfig {
    realTimeUrl: string
    language: string
}

interface AlarmsConfig {
    utcOffset: string
}

interface NotificationsConfig {
    configFile: string
}

const appConfig = config.get('config') as Config;
export {appConfig as Config}