import {Service} from "typedi";
import {Subway} from "../../subways/entities/Subway";
import {Alarm} from "../entities/Alarm";

@Service()
export class AlarmSender {

    public async sendAlarm(_subway: Subway, _alarm: Alarm): Promise<void> {
        // TODO implement this
    }
}