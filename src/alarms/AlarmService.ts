import {Service} from "typedi";
import {AlarmRepository} from "./AlarmRepository";
import {Alarm} from "./entities/Alarm";
import {Result} from "../utils/Result";
import {Validator} from "../utils/Validator";
import {AlarmInput} from "./entities/AlarmInput";
import {SubwayRepository} from "../subways/SubwayRepository";
import {User} from "../users/entities/User";

@Service()
export class AlarmService {

    static readonly ALARM_NOT_FOUND_ERROR = "ALARM_NOT_FOUND_ERROR";
    static readonly SUBWAY_NOT_FOUND_ERROR = "SUBWAY_NOT_FOUND_ERROR";

    constructor(private repository: AlarmRepository, private subwayRepository: SubwayRepository) {
    }

    public async get(alarmId: number, owner: User): Promise<Alarm | undefined> {
        const alarm = await this.repository.get(alarmId);
        if (alarm && owner.equals(alarm.owner)) {
            return alarm;
        }
        return undefined;
    }

    public async getAll(owner: User): Promise<Array<Alarm>> {
        return await this.repository.getForUser(owner);
    }

    public async create(alarmInput: AlarmInput): Promise<Result<Alarm>> {
        const subways = await this.subwayRepository.findByLines(alarmInput.subwayLines);
        if (subways.length != alarmInput.subwayLines.length) {
            return Result.Error(AlarmService.SUBWAY_NOT_FOUND_ERROR);
        }
        alarmInput.setSubways(subways);

        const alarm = new Alarm(alarmInput);

        const validation = await Validator.validate(alarm);
        if (!validation.isSuccessful()) {
            return Result.Error(validation.getError());
        }

        const saved = await this.repository.save(alarm);
        return Result.Success(saved);
    }

    async delete(alarmId: number, owner: User): Promise<Result<number>> {
        const alarm = await this.get(alarmId, owner);
        if (!alarm) {
            return Result.Error(AlarmService.ALARM_NOT_FOUND_ERROR);
        }

        await this.repository.delete(alarm);
        return Result.Success(alarmId);
    }
}