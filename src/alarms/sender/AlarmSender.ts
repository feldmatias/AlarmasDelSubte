import {Service} from "typedi";
import {Subway} from "../../subways/entities/Subway";
import {Alarm} from "../entities/Alarm";
import {AlarmNotificationSender} from "./notifications/AlarmNotificationSender";
import {MomentDate} from "../../utils/MomentDate";
import {SubwayAlarm} from "../entities/SubwayAlarm";
import {SubwayStatus} from "../../subways/SubwayStatus";
import {AlarmRepository} from "../AlarmRepository";

@Service()
export class AlarmSender {

    public constructor(private alarmRepository: AlarmRepository, private notificationSender: AlarmNotificationSender) {
    }

    public async sendAlarm(alarm: Alarm, subway: Subway, now: MomentDate): Promise<void> {
        const subwayAlarm = alarm.getSubwayAlarm(subway);

        if (!subwayAlarm) {
            return;
        }

        if (this.shouldSendAlarm(subwayAlarm, now)) {
            subwayAlarm.updateStatus(subway.status);
            await this.alarmRepository.save(alarm);
            await this.notificationSender.sendNotification(alarm, subway);
        }
    }

    private shouldSendAlarm(subwayAlarm: SubwayAlarm, now: MomentDate): boolean {
        if (subwayAlarm.subway.statusType() == SubwayStatus.Normal) {
            return now.isSameDate(subwayAlarm.lastAlarmSent.date);
        }

        return true;
    }
}