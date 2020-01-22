import {Service} from "typedi";
import {AlarmRepository} from "./AlarmRepository";
import {Alarm} from "./entities/Alarm";
import {Result} from "../utils/Result";
import {Validator} from "../utils/Validator";
import {AlarmInput} from "./entities/AlarmInput";
import {SubwayRepository} from "../subways/SubwayRepository";
import {User} from "../users/entities/User";
import {AlarmPartialInput} from "./entities/AlarmPartialInput";

@Service()
export class AlarmService {

    public static readonly ALARM_NOT_FOUND_ERROR = "ALARM_NOT_FOUND_ERROR";
    public static readonly SUBWAY_NOT_FOUND_ERROR = "SUBWAY_NOT_FOUND_ERROR";

    public constructor(private repository: AlarmRepository, private subwayRepository: SubwayRepository) {
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
        const inputInitialization = await this.initializeAlarmInput(alarmInput);
        if (!inputInitialization.isSuccessful()) {
            return Result.Error(inputInitialization.getError());
        }

        const alarm = new Alarm(inputInitialization.getData());
        return await this.saveAlarm(alarm);
    }

    public async edit(alarmId: number, alarmInput: AlarmPartialInput): Promise<Result<Alarm>> {
        const alarm = await this.get(alarmId, alarmInput.getOwner());
        if (!alarm) {
            return Result.Error(AlarmService.ALARM_NOT_FOUND_ERROR);
        }

        const inputInitialization = await this.initializeAlarmInput(alarmInput);
        if (!inputInitialization.isSuccessful()) {
            return Result.Error(inputInitialization.getError());
        }

        alarm.update(inputInitialization.getData());
        return await this.saveAlarm(alarm);
    }

    private async initializeAlarmInput<T extends AlarmInput | AlarmPartialInput>(alarmInput: T): Promise<Result<T>> {
        if (alarmInput.subwayLines) {
            const subways = await this.subwayRepository.findByLines(alarmInput.subwayLines);
            if (subways.length != alarmInput.subwayLines.length) {
                return Result.Error(AlarmService.SUBWAY_NOT_FOUND_ERROR);
            }
            alarmInput.setSubways(subways);
        }
        return Result.Success(alarmInput);
    }

    private async saveAlarm(alarm: Alarm): Promise<Result<Alarm>> {
        const validation = await Validator.validate(alarm);
        if (!validation.isSuccessful()) {
            return Result.Error(validation.getError());
        }

        const saved = await this.repository.save(alarm);
        return Result.Success(saved);
    }

    public async delete(alarmId: number, owner: User): Promise<Result<number>> {
        const alarm = await this.get(alarmId, owner);
        if (!alarm) {
            return Result.Error(AlarmService.ALARM_NOT_FOUND_ERROR);
        }

        await this.repository.delete(alarm);
        return Result.Success(alarmId);
    }
}