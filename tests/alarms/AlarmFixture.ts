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

    private alarmInput: AlarmInput;
    private subways: Subway[];
    private owner: string;
    private ownerFirebaseToken: string;
    private lastAlarmSent?: LastAlarmSent;
    private hasSubways = true;

    public constructor() {
        this.alarmInput = new AlarmInput();
        this.alarmInput.name = "alarm";
        this.alarmInput.days = ["friday", "monday"];
        this.alarmInput.start = "10:30";
        this.alarmInput.end = "12:46";

        this.subways = [];
        this.owner = "alarmOwner";
        this.ownerFirebaseToken = "";
    }

    public withSubway(subway: Subway): AlarmFixture {
        return this.withSubways([subway]);
    }

    public withSubways(subways: Subway[]): AlarmFixture {
        this.subways = subways;
        return this;
    }

    public withoutSubways(): AlarmFixture {
        this.hasSubways = false;
        return this;
    }

    public withOwner(username: string): AlarmFixture {
        this.owner = username;
        return this;
    }

    public withStart(start: string): AlarmFixture {
        this.alarmInput.start = start;
        return this;
    }

    public withEnd(end: string): AlarmFixture {
        this.alarmInput.end = end;
        return this;
    }

    public withTimeRange(start: string, end: string): AlarmFixture {
        this.withStart(start);
        this.withEnd(end);
        return this;
    }

    public withName(name: string): AlarmFixture {
        this.alarmInput.name = name;
        return this;
    }

    public withDay(day: string): AlarmFixture {
        return this.withDays([day]);
    }

    public withDays(days: string[]): AlarmFixture {
        this.alarmInput.days = days;
        return this;
    }

    public withLastAlarmSent(dateAfterAlarmStart = true, status?: string): AlarmFixture {
        const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
        this.withTimeRange(start, end);
        this.withDay(today);

        this.lastAlarmSent = new LastAlarmSent();

        this.lastAlarmSent.status = status ? status : this.subways[0].status;

        this.lastAlarmSent.date = dateAfterAlarmStart ?
            DateTestUtils.afterTime(start).utc(true).toDate() :
            DateTestUtils.yesterday(start).utc(true).toDate();
        return this;
    }

    public withOwnerFirebaseToken(firebaseToken: string): AlarmFixture {
        this.ownerFirebaseToken = firebaseToken;
        return this;
    }

    public async getAlarmInput(): Promise<AlarmInput> {
        if (this.subways.length == 0 && this.hasSubways) {
            const defaultSubway = await SubwayFixture.createSubway(AlarmFixture.ALARM_SUBWAY_LINE);
            this.withSubway(defaultSubway);
        }

        this.alarmInput.subwayLines = this.subways.map(subway => subway.line);

        if (this.owner) {
            const owner = await new UserFixture().withUsername(this.owner).createUser();
            owner.firebaseToken = this.ownerFirebaseToken;
            this.alarmInput.setOwner(owner);
        }

        return this.alarmInput;
    }

    public async createAlarm(): Promise<Alarm> {
        this.alarmInput = await this.getAlarmInput();
        this.alarmInput.setSubways(this.subways);

        const lastAlarmSent = this.lastAlarmSent;
        if (lastAlarmSent) {
            return await this.createAlarmWithLastAlarmSent(lastAlarmSent);
        }

        const alarm = new Alarm(this.alarmInput);
        return await getRepository(Alarm).save(alarm);
    }

    private async createAlarmWithLastAlarmSent(lastAlarmSent: LastAlarmSent): Promise<Alarm> {
        const alarm = new Alarm(this.alarmInput);

        alarm.subwayAlarms.map(subwayAlarm => {
            subwayAlarm.lastAlarmSent = new LastAlarmSent();
            subwayAlarm.lastAlarmSent.status = lastAlarmSent.status;
            subwayAlarm.lastAlarmSent.date = lastAlarmSent.date;
        });

        await getRepository(Alarm).save(alarm);

        alarm.subwayAlarms.map(subwayAlarm => {
            subwayAlarm.lastAlarmSent.date = lastAlarmSent.date; //Because it is redefined in constructor.
        });

        return alarm;
    }

}