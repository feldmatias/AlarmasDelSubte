import {anyOfClass, capture, instance, mock, verify} from "ts-mockito";
import {AlarmSender} from "../../../src/alarms/sender/AlarmSender";
import {AlarmRepository} from "../../../src/alarms/AlarmRepository";
import {SubwayAlarmSender} from "../../../src/alarms/sender/SubwayAlarmSender";
import {Container} from "typedi";
import {Subway} from "../../../src/subways/entities/Subway";
import {SubwayFixture} from "../../subways/SubwayFixture";
import {AlarmFixture} from "../AlarmFixture";
import {Alarm} from "../../../src/alarms/entities/Alarm";
import {DateTestUtils} from "../../utils/DateTestUtils";
import { expect } from "chai";

describe("Subway Alarm Sender", () => {

    let alarmSender: AlarmSender;
    let subwayAlarmSender: SubwayAlarmSender;
    beforeEach(async () => {
        alarmSender = mock(AlarmSender);
        const repository = Container.get(AlarmRepository);
        subwayAlarmSender = new SubwayAlarmSender(instance(alarmSender), repository);
    });

    context("send subway alarms", () => {

        let subway: Subway;
        const now = DateTestUtils.now();
        beforeEach(async () => {
            subway = await SubwayFixture.createSubway();
        });

        context("conditions to send alarm", () => {

            it("should send to alarm which last sent status equals current status and last send date is before start", async () => {
                const alarm = await AlarmFixture.createAlarmWithLastSubwayAlarmSent(subway, false);

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(subway, anyOfClass(Alarm))).once();
                expect(capture(alarmSender.sendAlarm).first()[1].id).to.eq(alarm.id);
            });

            it("should send to alarm which last sent status differs current status and last send date is before start", async () => {
                const alarm = await AlarmFixture.createAlarmWithLastSubwayAlarmSent(subway, false, "other status");

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(subway, anyOfClass(Alarm))).once();
                expect(capture(alarmSender.sendAlarm).first()[1].id).to.eq(alarm.id);
            });

            it("should send to alarm which last sent status differs current status and last send date is after start", async () => {
                const alarm = await AlarmFixture.createAlarmWithLastSubwayAlarmSent(subway, true, "other status");

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(subway, anyOfClass(Alarm))).once();
                expect(capture(alarmSender.sendAlarm).first()[1].id).to.eq(alarm.id);
            });

            it("should send to alarm which has today in days array", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                const days = [DateTestUtils.yesterdayDay(), today, DateTestUtils.tomorrowDay()];
                const alarm = await AlarmFixture.createAlarmWithRange(start, end, days, [subway]);

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(subway, anyOfClass(Alarm))).once();
                expect(capture(alarmSender.sendAlarm).first()[1].id).to.eq(alarm.id);
            });

            it("should send to alarm which has today first in days array", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                const days = [today, DateTestUtils.yesterdayDay(), DateTestUtils.tomorrowDay()];
                const alarm = await AlarmFixture.createAlarmWithRange(start, end, days, [subway]);

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(subway, anyOfClass(Alarm))).once();
                expect(capture(alarmSender.sendAlarm).first()[1].id).to.eq(alarm.id);
            });

            it("should send to alarm which has today last in days array", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                const days = [DateTestUtils.yesterdayDay(), DateTestUtils.tomorrowDay(), today];
                const alarm = await AlarmFixture.createAlarmWithRange(start, end, days, [subway]);

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(subway, anyOfClass(Alarm))).once();
                expect(capture(alarmSender.sendAlarm).first()[1].id).to.eq(alarm.id);
            });

            it("should send to alarm which has other subways too", async () => {
                const otherSubway = await SubwayFixture.createSubway("other");
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                const alarm = await AlarmFixture.createAlarmWithRange(start, end, [today], [subway, otherSubway]);

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(subway, anyOfClass(Alarm))).once();
                expect(capture(alarmSender.sendAlarm).first()[1].id).to.eq(alarm.id);
            });

            it("should send to multiple alarms", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                const alarm1 = await AlarmFixture.createAlarmWithRange(start, end, [today], [subway], "1");
                const alarm2 = await AlarmFixture.createAlarmWithRange(start, end, [today], [subway], "2");
                const alarm3 = await AlarmFixture.createAlarmWithRange(start, end, [today], [subway], "3");

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(subway, anyOfClass(Alarm))).thrice();
                expect(capture(alarmSender.sendAlarm).first()[1].id).to.eq(alarm1.id);
                expect(capture(alarmSender.sendAlarm).second()[1].id).to.eq(alarm2.id);
                expect(capture(alarmSender.sendAlarm).third()[1].id).to.eq(alarm3.id);
            });

        });

        context("conditions to not send alarm", () => {

            it("should not send to alarm outside range, before start", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeBeforeNow();
                await AlarmFixture.createAlarmWithRange(start, end, [today], [subway]);

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Subway), anyOfClass(Alarm))).never();
            });

            it("should not send to alarm outside range, after end", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeAfterNow();
                await AlarmFixture.createAlarmWithRange(start, end, [today], [subway]);

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Subway), anyOfClass(Alarm))).never();
            });

            it("should not send to alarm from other day, after today", async () => {
                const [start, end] = DateTestUtils.getTimeRangeWithNowInside();
                const afterToday = DateTestUtils.tomorrowDay();
                await AlarmFixture.createAlarmWithRange(start, end, [afterToday], [subway]);

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Subway), anyOfClass(Alarm))).never();
            });

            it("should not send to alarm from other day, before today", async () => {
                const [start, end] = DateTestUtils.getTimeRangeWithNowInside();
                const beforeToday = DateTestUtils.yesterdayDay();
                await AlarmFixture.createAlarmWithRange(start, end, [beforeToday], [subway]);

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Subway), anyOfClass(Alarm))).never();
            });

            it("should not send to alarm for other subway", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                await AlarmFixture.createAlarmWithRange(start, end, [today], [subway]);

                const otherSubway = await SubwayFixture.createSubway("other");

                await subwayAlarmSender.sendSubwayAlarms(otherSubway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Subway), anyOfClass(Alarm))).never();
            });

            it("should not send to alarm which last sent status equals current status and last send date is after start", async () => {
                await AlarmFixture.createAlarmWithLastSubwayAlarmSent(subway, true);

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Subway), anyOfClass(Alarm))).never();
            });
        });

    });

});