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

            it("should send to alarm which last sent status equals current status and last send date is before todays", async () => {
                const alarm = await new AlarmFixture().withSubway(subway).withLastAlarmSent(false).createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), subway, now)).once();
                expect(capture(alarmSender.sendAlarm).first()[0].id).to.eq(alarm.id);
            });

            it("should send to alarm which last sent status differs current status and last send date is before today", async () => {
                const alarm = await new AlarmFixture().withSubway(subway).withLastAlarmSent(false, "other status").createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), subway, now)).once();
                expect(capture(alarmSender.sendAlarm).first()[0].id).to.eq(alarm.id);
            });

            it("should send to alarm which last sent status differs current status and last send date is today", async () => {
                const alarm = await new AlarmFixture().withSubway(subway).withLastAlarmSent(true, "other status").createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), subway, now)).once();
                expect(capture(alarmSender.sendAlarm).first()[0].id).to.eq(alarm.id);
            });

            it("should send to alarm which has today in days array", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                const days = [DateTestUtils.yesterdayDay(), today, DateTestUtils.tomorrowDay()];
                const alarm = await new AlarmFixture().withSubway(subway).withTimeRange(start, end).withDays(days).createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), subway, now)).once();
                expect(capture(alarmSender.sendAlarm).first()[0].id).to.eq(alarm.id);
            });

            it("should send to alarm which has today first in days array", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                const days = [today, DateTestUtils.yesterdayDay(), DateTestUtils.tomorrowDay()];
                const alarm = await new AlarmFixture().withSubway(subway).withTimeRange(start, end).withDays(days).createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), subway, now)).once();
                expect(capture(alarmSender.sendAlarm).first()[0].id).to.eq(alarm.id);
            });

            it("should send to alarm which has today last in days array", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                const days = [DateTestUtils.yesterdayDay(), DateTestUtils.tomorrowDay(), today];
                const alarm = await new AlarmFixture().withSubway(subway).withTimeRange(start, end).withDays(days).createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), subway, now)).once();
                expect(capture(alarmSender.sendAlarm).first()[0].id).to.eq(alarm.id);
            });

            it("should send to alarm which has other subways too", async () => {
                const otherSubway = await SubwayFixture.createSubway("other");
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                const alarm = await new AlarmFixture().withSubways([subway, otherSubway])
                    .withTimeRange(start, end).withDay(today).createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), subway, now)).once();
                expect(capture(alarmSender.sendAlarm).first()[0].id).to.eq(alarm.id);
            });

            it("should send to multiple alarms", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                const alarm1 = await new AlarmFixture().withSubway(subway)
                    .withTimeRange(start, end).withDay(today).withOwner("1").createAlarm();
                const alarm2 = await new AlarmFixture().withSubway(subway)
                    .withTimeRange(start, end).withDay(today).withOwner("2").createAlarm();
                const alarm3 = await new AlarmFixture().withSubway(subway)
                    .withTimeRange(start, end).withDay(today).withOwner("3").createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), subway, now)).thrice();
                expect(capture(alarmSender.sendAlarm).first()[0].id).to.eq(alarm1.id);
                expect(capture(alarmSender.sendAlarm).second()[0].id).to.eq(alarm2.id);
                expect(capture(alarmSender.sendAlarm).third()[0].id).to.eq(alarm3.id);
            });

        });

        context("conditions to not send alarm", () => {

            it("should not send to alarm outside range, before start", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeBeforeNow();
                await new AlarmFixture().withSubway(subway).withTimeRange(start, end).withDay(today).createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), anyOfClass(Subway), now)).never();
            });

            it("should not send to alarm outside range, after end", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeAfterNow();
                await new AlarmFixture().withSubway(subway).withTimeRange(start, end).withDay(today).createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), anyOfClass(Subway), now)).never();
            });

            it("should not send to alarm from other day, after today", async () => {
                const [start, end] = DateTestUtils.getTimeRangeWithNowInside();
                const afterToday = DateTestUtils.tomorrowDay();
                await new AlarmFixture().withSubway(subway).withTimeRange(start, end).withDay(afterToday).createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), anyOfClass(Subway), now)).never();
            });

            it("should not send to alarm from other day, before today", async () => {
                const [start, end] = DateTestUtils.getTimeRangeWithNowInside();
                const beforeToday = DateTestUtils.yesterdayDay();
                await new AlarmFixture().withSubway(subway).withTimeRange(start, end).withDay(beforeToday).createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), anyOfClass(Subway), now)).never();
            });

            it("should not send to alarm for other subway", async () => {
                const [start, end, today] = DateTestUtils.getTimeRangeWithNowInside();
                await new AlarmFixture().withSubway(subway).withTimeRange(start, end).withDay(today).createAlarm();

                const otherSubway = await SubwayFixture.createSubway("other");

                await subwayAlarmSender.sendSubwayAlarms(otherSubway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), anyOfClass(Subway), now)).never();
            });

            it("should not send to alarm which last sent status equals current status and last send date is today", async () => {
                await new AlarmFixture().withSubway(subway).withLastAlarmSent(true).createAlarm();

                await subwayAlarmSender.sendSubwayAlarms(subway, now);

                verify(alarmSender.sendAlarm(anyOfClass(Alarm), anyOfClass(Subway), now)).never();
            });
        });

    });

});