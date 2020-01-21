import {AlarmInput} from "../../src/alarms/entities/AlarmInput";
import {SubwayFixture} from "../subways/SubwayFixture";
import {UserFixture} from "../users/UserFixture";
import {Alarm} from "../../src/alarms/entities/Alarm";
import {getRepository} from "typeorm";

export class AlarmFixture {

    public static async getDefaultAlarmInput(withOwner = true): Promise<AlarmInput> {
        const defaultSubway = await SubwayFixture.createSubway();

        const alarm = new AlarmInput();
        alarm.name = "alarm";
        alarm.days = ["friday", "monday"];
        alarm.start = "10:30";
        alarm.end = "12:46";
        alarm.subwayLines = [defaultSubway.line];

        if (withOwner) {
            const defaultUser = await UserFixture.createUser();
            alarm.setOwner(defaultUser);
        }

        return alarm;
    };

    public static async createAlarm(): Promise<Alarm> {
        const alarmInput = await this.getDefaultAlarmInput();
        const alarm = new Alarm(alarmInput);
        return await getRepository(Alarm).save(alarm);
    }
}