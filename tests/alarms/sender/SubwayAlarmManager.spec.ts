import {anyOfClass, capture, instance, mock, verify} from "ts-mockito";
import {SubwayAlarmSender} from "../../../src/alarms/sender/SubwayAlarmSender";
import {Container} from "typedi";
import {Subway} from "../../../src/subways/entities/Subway";
import {SubwayFixture} from "../../subways/SubwayFixture";
import {DateTestUtils} from "../../utils/DateTestUtils";
import {expect} from "chai";
import {SubwayAlarmManager} from "../../../src/alarms/sender/SubwayAlarmManager";
import {SubwayRepository} from "../../../src/subways/SubwayRepository";

describe("Subway Alarm Manager", () => {

    let subwayAlarmSender: SubwayAlarmSender;
    let alarmManager: SubwayAlarmManager;
    beforeEach(async () => {
        subwayAlarmSender = mock(SubwayAlarmSender);
        const repository = Container.get(SubwayRepository);
        alarmManager = new SubwayAlarmManager(instance(subwayAlarmSender), repository);
    });

    context("send alarms", () => {

        context("conditions to send alarms", () => {

            it("should send alarms for subway updated now", async () => {
                const subway = await new SubwayFixture().createSubway();
                const now = DateTestUtils.now(subway.updatedAt);

                await alarmManager.sendAlarms(now);

                verify(subwayAlarmSender.sendSubwayAlarms(anyOfClass(Subway), now)).once();
                expect(capture(subwayAlarmSender.sendSubwayAlarms).first()[0].line).to.eq(subway.line);
            });

            it("should send alarms for subway updated 59 minutes ago", async () => {
                const subway = await new SubwayFixture().createSubway();
                subway.updatedAt.setMinutes(subway.updatedAt.getMinutes() + 59);
                const now = DateTestUtils.now(subway.updatedAt);

                await alarmManager.sendAlarms(now);

                verify(subwayAlarmSender.sendSubwayAlarms(anyOfClass(Subway), now)).once();
                expect(capture(subwayAlarmSender.sendSubwayAlarms).first()[0].line).to.eq(subway.line);
            });

            it("should send alarms for multiple subways", async () => {
                const subway1 = await new SubwayFixture().withLine("1").createSubway();
                const subway2 = await new SubwayFixture().withLine("2").createSubway();
                const subway3 = await new SubwayFixture().withLine("3").createSubway();
                const now = DateTestUtils.now(subway1.updatedAt);

                await alarmManager.sendAlarms(now);

                verify(subwayAlarmSender.sendSubwayAlarms(anyOfClass(Subway), now)).thrice();
                expect(capture(subwayAlarmSender.sendSubwayAlarms).first()[0].line).to.eq(subway1.line);
                expect(capture(subwayAlarmSender.sendSubwayAlarms).second()[0].line).to.eq(subway2.line);
                expect(capture(subwayAlarmSender.sendSubwayAlarms).third()[0].line).to.eq(subway3.line);
            });

            it("should send alarms for subways updated less than an hour ago", async () => {
                const subway1 = await new SubwayFixture().withLine("1").withUpdatedAt(new Date()).createSubway();

                const updatedHourAgo = subway1.updatedAt;
                updatedHourAgo.setHours(updatedHourAgo.getHours() - 1);
                await new SubwayFixture().withLine("2").withUpdatedAt(updatedHourAgo).createSubway();

                const subway3 = await new SubwayFixture().withLine("3").withUpdatedAt(new Date()).createSubway();
                const now = DateTestUtils.now(new Date());

                await alarmManager.sendAlarms(now);

                verify(subwayAlarmSender.sendSubwayAlarms(anyOfClass(Subway), now)).twice();
                expect(capture(subwayAlarmSender.sendSubwayAlarms).first()[0].line).to.eq(subway1.line);
                expect(capture(subwayAlarmSender.sendSubwayAlarms).second()[0].line).to.eq(subway3.line);
            });

        });

        context("conditions to not send alarms", () => {

            it("should not send alarms for subway updated an hour ago", async () => {
                const subway = await new SubwayFixture().createSubway();
                subway.updatedAt.setHours(subway.updatedAt.getHours() + 1);
                const now = DateTestUtils.now(subway.updatedAt);

                await alarmManager.sendAlarms(now);

                verify(subwayAlarmSender.sendSubwayAlarms(anyOfClass(Subway), now)).never();
            });

        });

    });

});