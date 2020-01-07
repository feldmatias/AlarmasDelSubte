import {createConnection} from "typeorm";
import {Config} from "../../config/config";

export class Db {
    static async create(): Promise<void> {
        const dbType: any = Config.db.type;
        await createConnection({
            type: dbType,
            database: Config.db.name,
            entities: [
                "./**/entities/**/*" + Config.src.fileExtension
            ],
            migrations: ["./**/migration/*" + Config.src.fileExtension],
            synchronize: false,
            logging: false,
            migrationsRun: true
        });
    }
}