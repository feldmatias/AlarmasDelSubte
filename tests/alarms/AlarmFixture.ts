import {AlarmInput} from "../../src/alarms/entities/AlarmInput";
import {SubwayFixture} from "../subways/SubwayFixture";
import {UserFixture} from "../users/UserFixture";
import {Alarm} from "../../src/alarms/entities/Alarm";
import {getRepository} from "typeorm";
import {Subway} from "../../src/subways/entities/Subway";
import {DateTestUtils} from "../utils/DateTestUtils";
import {LastAlarmSent} from "../../src/alarms/entities/LastAlarmSent";

export class AlarmFixture {

    public static readonly ALARM_SUBWAY_LINE = "alarm";

    public static async getDefaultAlarmInput(withOwner = true, withSubway = true): Promise<AlarmInput> {
        const alarm = new AlarmInput();
        alarm.name = "alarm";
        alarm.days = ["friday", "monday"];
        alarm.start = "10:30";
        alarm.end = "12:46";

        if (withSubway) {
            const defaultSubway = await SubwayFixture.createSubway(AlarmFixture.ALARM_SUBWAY_LINE);
            alarm.subwayLines = [defaultSubway.line];
        }

        if (withOwner) {
            const defaultUser = await UserFixture.createUser();
            alarm.setOwner(defaultUser);
        }

        return alarm;
    };

    public static async createAlarm(): Promise<Alarm> {
        const alarmInput = await this.getDefaultAlarmInput(true, false);
        const defaultSubway = await SubwayFixture.createSubway(AlarmFixture.ALARM_SUBWAY_LINE);
        alarmInput.setSubways([defaultSubway]);

        const alarm = new Alarm(alarmInput);
        return await getRepository(Alarm).save(alarm);
    }

    public static async createAlarmWithTimeRange(start: string, end: string, days: string[], subways: Subway[], username?: string): Promise<Alarm> {
        const alarmInput = await this.getDefaultAlarmInput(username == "", false);
        alarmInput.start = start;
        alarmInput.end = end;
        alarmInput.days = days.map(day => day.toLowerCase());
        alarmInput.setSubways(subways);

        if (username) {
            const user = await UserFixture.createUserWithUsername(username);
            alarmInput.setOwner(user);
        }

        const alarm = new Alarm(alarmInput);
        return await getRepository(Alarm).save(alarm);
    }

    public static async createAlarmWithLastSubwayAlarmSent(subway: Subway, lastAlarmSentAfterStart = true, lastStatus?: string): Promise<Alarm> {
        const alarmInput = await this.getDefaultAlarmInput(true, false);
        const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
        alarmInput.start = start;
        alarmInput.end = end;
        alarmInput.days = [today.toLowerCase()];
        alarmInput.setSubways([subway]);

        const alarm = new Alarm(alarmInput);

        alarm.subwayAlarms.map(subwayAlarm => {
            subwayAlarm.lastAlarmSent = new LastAlarmSent();
            subwayAlarm.lastAlarmSent.status = lastStatus ? lastStatus : subway.status;
            subwayAlarm.lastAlarmSent.date = lastAlarmSentAfterStart ?
                DateTestUtils.afterTime(start).utc(true).toDate() :
                DateTestUtils.yesterday(start).utc(true).toDate();
        });

        return await getRepository(Alarm).save(alarm);
    }
}