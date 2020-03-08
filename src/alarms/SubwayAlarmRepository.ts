import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Repository} from "typeorm";
import {SubwayAlarm} from "./entities/SubwayAlarm";


@Service()
export class SubwayAlarmRepository {

    public constructor(@InjectRepository(SubwayAlarm) private repository: Repository<SubwayAlarm>) {
    }

    public async update(subwayAlarm: SubwayAlarm): Promise<SubwayAlarm> {
        return this.repository.save(subwayAlarm);
    }
}
