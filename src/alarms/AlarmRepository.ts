import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Brackets, Repository} from "typeorm";
import {Alarm} from "./entities/Alarm";
import {User} from "../users/entities/User";
import {Subway} from "../subways/entities/Subway";
import {Moment} from "moment";
import {Config} from "../../config/config";


@Service()
export class AlarmRepository {

    public constructor(@InjectRepository(Alarm) private repository: Repository<Alarm>) {
    }

    public async save(alarm: Alarm): Promise<Alarm> {
        return this.repository.save(alarm);
    }

    public async get(alarmId: number): Promise<Alarm | undefined> {
        return await this.repository.findOne({id: alarmId}, {relations: ["subwayAlarms", "subwayAlarms.subway", "owner"]});
    }

    public async getForUser(user: User): Promise<Array<Alarm>> {
        return await this.repository.find({
            where: {
                owner: {
                    id: user.id
                }
            },
            relations: ["subwayAlarms", "subwayAlarms.subway"]
        });
    }

    public async delete(alarm: Alarm): Promise<void> {
        await this.repository.remove(alarm);
    }

    public async getForSubway(subway: Subway, now: Moment): Promise<Array<Alarm>> {
        const date = now.format("YYYY-MM-DD");
        const day = now.format('dddd').toLowerCase();
        const time = now.format('HH:mm');

        return await this.repository.createQueryBuilder("alarm")
            .innerJoinAndSelect("alarm.subwayAlarms", "subwayAlarm")
            .innerJoinAndSelect("subwayAlarm.subway", "subway", "subway.line = :line", {line: subway.line})
            .where("alarm.days like :day", {day: `%${day}%`})
            .andWhere("alarm.start <= :time", {time})
            .andWhere("alarm.end >= :time", {time})
            .andWhere(new Brackets(qb => {
                qb.where("subwayAlarm.lastAlarmSent.status != :status", {status: subway.status})
                    .orWhere("datetime(subwayAlarm.lastAlarmSent.date) < datetime(:date || ' ' || alarm.start || ':00 ' || :timezone)", {date: date, timezone: Config.alarms.utcOffset});
            }))
            .getMany();
    }
}