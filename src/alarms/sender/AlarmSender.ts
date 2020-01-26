import {Service} from "typedi";
import {Subway} from "../../subways/entities/Subway";
import {Alarm} from "../entities/Alarm";
import {AlarmNotificationSender} from "./notifications/AlarmNotificationSender";
import {MomentDate} from "../../utils/MomentDate";
import {SubwayAlarm} from "../entities/SubwayAlarm";
import {SubwayStatus} from "../../subways/SubwayStatus";

@Service()
export class AlarmSender {

    public constructor(private notificationSender: AlarmNotificationSender) {}

    public async sendAlarm(alarm: Alarm, subway: Subway, now: MomentDate): Promise<void> {
        const subwayAlarm = alarm.getSubwayAlarm(subway);

        if (this.shouldSendAlarm(subwayAlarm, now)) {
            await this.notificationSender.sendNotification(alarm, subway);
        }
    }

    private shouldSendAlarm(subwayAlarm: SubwayAlarm | undefined, now: MomentDate): boolean {
        if (!subwayAlarm) {
            return false;
        }

        if (subwayAlarm.subway.statusType() == SubwayStatus.Normal) {
            return now.isSameDate(subwayAlarm.lastAlarmSent.date);
        }

        return true;
    }
}