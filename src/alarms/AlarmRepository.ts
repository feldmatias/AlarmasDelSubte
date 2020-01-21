import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Repository} from "typeorm";
import {Alarm} from "./entities/Alarm";
import {User} from "../users/entities/User";


@Service()
export class AlarmRepository {

    public constructor(@InjectRepository(Alarm) private repository: Repository<Alarm>) {
    }

    public async save(alarm: Alarm): Promise<Alarm> {
        return this.repository.save(alarm);
    }

    public async get(alarmId: number): Promise<Alarm | undefined> {
        return await this.repository.findOne({id: alarmId}, {relations: ["subways", "owner"]});
    }

    public async getForUser(user: User): Promise<Array<Alarm>> {
        return await this.repository.find({
            where: {
                owner: {
                    id: user.id
                }
            },
            relations: ["subways"]
        });
    }

    public async delete(alarm: Alarm): Promise<void> {
        await this.repository.remove(alarm);
    }
}