import {createConnection, useContainer} from "typeorm";
import {Config} from "../../config/config";
import {Container} from "typedi";

export class Db {
    static async create(): Promise<void> {
        useContainer(Container);
        const dbType: any = Config.db.type; // eslint-disable-line  @typescript-eslint/no-explicit-any
        await createConnection({
            type: dbType,
            database: Config.db.name,
            entities: [
                process.cwd() + Config.src.folder + "/src/**/entities/**/*" + Config.src.fileExtension
            ],
            migrations: [__dirname + "/migration/*" + Config.src.fileExtension],
            synchronize: false,
            logging: false,
            migrationsRun: true
        });
    }
}