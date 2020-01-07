import {createConnection} from "typeorm";
import {Config} from "../../config/config";

export class Db {
    static async create(): Promise<void> {
        await createConnection({
            type: Config.db.type,
            database: Config.db.name,
            entities: [
                "./**/entities/**/*" + Config.src.fileExtension
            ],
            synchronize: true,
            logging: false
        });
    }
}