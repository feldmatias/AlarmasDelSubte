import {Service} from "typedi";
import {AlarmRepository} from "./AlarmRepository";
import {Alarm} from "./entities/Alarm";
import {Result} from "../utils/Result";
import {Validator} from "../utils/Validator";
import {AlarmInput} from "./entities/AlarmInput";
import {SubwayRepository} from "../subways/SubwayRepository";

@Service()
export class AlarmService {

    static SUBWAY_NOT_FOUND_ERROR = "SUBWAY_NOT_FOUND_ERROR";

    constructor(private repository: AlarmRepository, private subwayRepository: SubwayRepository) {
    }

    public async get(alarmId: number): Promise<Alarm | undefined> {
        return await this.repository.get(alarmId);
    }

    public async create(alarm: AlarmInput): Promise<Result<Alarm>> {
        const subways = await this.subwayRepository.findByLines(alarm.subwayLines);
        if (subways.length != alarm.subwayLines.length) {
            return Result.Error(AlarmService.SUBWAY_NOT_FOUND_ERROR);
        }
        alarm.setSubways(subways);

        const validation = await Validator.validate(alarm);
        if (!validation.isSuccessful()) {
            return Result.Error(validation.getError());
        }

        const saved = await this.repository.save(alarm);
        return Result.Success(saved);
    }
}