import {Alarm} from "../../src/alarms/entities/Alarm";
import {expect} from "chai";
import {fail} from "assert";

export class AlarmAssert {

    public static assertAlarmEquals(alarm: Alarm | undefined, expectedAlarm: Alarm): void {
        if (!alarm) {
            fail("Alarm is undefined");
        }

        expect(alarm.name).to.eq(expectedAlarm.name);
        expect(alarm.days).to.deep.eq(expectedAlarm.days);
        expect(alarm.start).to.eq(expectedAlarm.start);
        expect(alarm.end).to.eq(expectedAlarm.end);
        this.assertAlarmsSubwaysEquals(alarm, expectedAlarm);
    }

    private static assertAlarmsSubwaysEquals(alarm: Alarm, expectedAlarm: Alarm): void {
        const subways = alarm.subways();
        const expectedSubways = expectedAlarm.subways();

        for (let i = 0; i < expectedSubways.length; i++) {
            expect(subways[i].line).to.eq(expectedSubways[i].line);
        }
    }
}