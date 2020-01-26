import {Service} from "typedi";
import {SubwayAlarmSender} from "./SubwayAlarmSender";
import {SubwayRepository} from "../../subways/SubwayRepository";
import {MomentDate} from "../../utils/MomentDate";
import {Subway} from "../../subways/entities/Subway";

@Service()
export class SubwayAlarmManager {

    private static readonly MAX_UPDATE_HOURS_TO_SEND_ALARMS = 1;

    public constructor(private subwayAlarmSender: SubwayAlarmSender, private subwayRepository: SubwayRepository) {
    }

    public async sendAlarms(now: MomentDate): Promise<void> {
        const subways = await this.subwayRepository.getAllOrdered();

        subways.forEach(subway => {
            if (this.shouldSendSubwayAlarm(subway, now)) {
                this.subwayAlarmSender.sendSubwayAlarms(subway, now); // No await. Should be handled in background;
            }
        });
    }

    private shouldSendSubwayAlarm(subway: Subway, now: MomentDate): boolean {
        return now.differenceInHours(subway.updatedAt) < SubwayAlarmManager.MAX_UPDATE_HOURS_TO_SEND_ALARMS;
    }
}