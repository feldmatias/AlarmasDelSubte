import {createConnection, useContainer} from "typeorm";
import {Config} from "../../config/config";
import {Container} from "typedi";

export class Db {
    static async create(): Promise<void> {
        useContainer(Container);
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const dbType: any = Config.db.type;
        await createConnection({
            type: dbType,
            database: Config.db.name,
            entities: [
                "./src/**/entities/**/*" + Config.src.fileExtension
            ],
            migrations: [__dirname + "/migration/*" + Config.src.fileExtension],
            synchronize: false,
            logging: false,
            migrationsRun: true
        });
    }
}