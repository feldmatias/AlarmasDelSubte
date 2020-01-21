import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Repository} from "typeorm";
import {Alarm} from "./entities/Alarm";
import {User} from "../users/entities/User";


@Service()
export class AlarmRepository {

    constructor(@InjectRepository(Alarm) private repository: Repository<Alarm>) {
    }

    async save(alarm: Alarm): Promise<Alarm> {
        return this.repository.save(alarm);
    }

    async get(alarmId: number): Promise<Alarm | undefined> {
        return await this.repository.findOne({id: alarmId}, {relations: ["subways", "owner"]});
    }

    async getForUser(user: User): Promise<Array<Alarm>> {
        return await this.repository.find({
            owner: {
                id: user.id
            }
        });
    }
}