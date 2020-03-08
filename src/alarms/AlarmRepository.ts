import {Service} from "typedi";
import {InjectRepository} from "typeorm-typedi-extensions";
import {Brackets, Repository} from "typeorm";
import {Alarm} from "./entities/Alarm";
import {User} from "../users/entities/User";
import {Subway} from "../subways/entities/Subway";
import {SelectQueryBuilder} from "typeorm/query-builder/SelectQueryBuilder";
import {MomentDate} from "../utils/MomentDate";


@Service()
export class AlarmRepository {

    public constructor(@InjectRepository(Alarm) private repository: Repository<Alarm>) {
    }

    public async get(alarmId: number): Promise<Alarm | undefined> {
        return await this.alarmQueryBuilder()
            .innerJoinAndSelect("alarm.owner", "owner")
            .where("alarm.id = :id", {id: alarmId})
            .getOne();
    }

    public async getForUser(user: User): Promise<Array<Alarm>> {
        return await this.alarmQueryBuilder()
            .innerJoin("alarm.owner", "owner", "owner.id = :ownerId", {ownerId: user.getId()})
            .getMany();
    }

    private alarmQueryBuilder(): SelectQueryBuilder<Alarm> {
        return this.repository.createQueryBuilder("alarm")
            .innerJoinAndSelect("alarm.subwayAlarms", "subwayAlarm")
            .innerJoinAndSelect("subwayAlarm.subway", "subway");
    }

    public async save(alarm: Alarm): Promise<Alarm> {
        return this.repository.save(alarm);
    }

    public async delete(alarm: Alarm): Promise<void> {
        await this.repository.remove(alarm);
    }

    public async getForSubway(subway: Subway, now: MomentDate): Promise<Array<Alarm>> {
        return await this.repository.createQueryBuilder("alarm")
            .innerJoinAndSelect("alarm.owner", "owner")
            .innerJoinAndSelect("alarm.subwayAlarms", "subwayAlarm")
            .innerJoinAndSelect("subwayAlarm.subway", "subway", "subway.line = :line", {line: subway.line})
            .where("alarm.days like :day", {day: `%${now.day()}%`})
            .andWhere("alarm.start <= :time", {time: now.time()})
            .andWhere("alarm.end >= :time", {time: now.time()})
            .andWhere(new Brackets(qb => {
                qb.where("subwayAlarm.lastAlarmSent.status != :status", {status: subway.status})
                    .orWhere("date(subwayAlarm.lastAlarmSent.date) < date(:date)", {date: now.date()});
            }))
            .getMany();
    }
}
