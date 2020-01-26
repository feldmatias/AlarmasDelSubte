import {Service} from "typedi";
import {AlarmSender} from "./AlarmSender";
import {Subway} from "../../subways/entities/Subway";
import {AlarmRepository} from "../AlarmRepository";
import {MomentDate} from "../../utils/MomentDate";

@Service()
export class SubwayAlarmSender {

    public constructor(private alarmSender: AlarmSender, private alarmRepository: AlarmRepository) {
    }

    public async sendSubwayAlarms(subway: Subway, now: MomentDate): Promise<void> {
        const alarms = await this.alarmRepository.getForSubway(subway, now);

        alarms.forEach(alarm => {
            this.alarmSender.sendAlarm(subway, alarm); //No await. Expected to be handled in background.
        });
    }

}