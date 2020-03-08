import {AlarmSender} from "../../../src/alarms/sender/AlarmSender";
import {Container} from "typedi";
import {Subway} from "../../../src/subways/entities/Subway";
import {SubwayFixture} from "../../subways/SubwayFixture";
import MockPushNotificationsService from "../../push_notifications/MockPushNotificationsService";
import {AlarmFixture} from "../AlarmFixture";
import {expect} from "chai";
import {AlarmNotification} from "../../../src/alarms/sender/notifications/AlarmNotification";
import {SubwayStatusHelper} from "../../../src/subways/SubwayStatus";
import {DateTestUtils} from "../../utils/DateTestUtils";
import {AlarmService} from "../../../src/alarms/AlarmService";

describe("Alarm Sender", () => {

    const NOTIFICATIONS_TOKEN = "token";

    let alarmSender: AlarmSender;
    beforeEach(async () => {
        MockPushNotificationsService.mock();
        alarmSender = Container.get(AlarmSender);
    });

    afterEach(() => {
        MockPushNotificationsService.reset();
    });

    context("send alarm", () => {

        const now = DateTestUtils.now();
        const NORMAL_STATUS = SubwayStatusHelper.NORMAL_STATUS_MESSAGE;

        context("conditions to send alarm", () => {

            SubwayStatusHelper.NORMAL_STATUS_OPTIONS.forEach(status => {
                it(`should send alarm if status is normal '${status}' and last sent date is today and last status is not normal`, async () => {
                    const subway = await new SubwayFixture().withStatus(status).createSubway();
                    const alarm = await new AlarmFixture().withSubway(subway)
                        .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent(true, "status").createAlarm();

                    await alarmSender.sendAlarm(alarm, subway, now);

                    MockPushNotificationsService.verifyNotificationSent();
                });
            });

            it("should send alarm if status is not normal and last sent date is today", async () => {
                const subway = await new SubwayFixture().withStatus("limited").createSubway();
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN)
                    .withLastAlarmSent(true, NORMAL_STATUS).createAlarm();

                await alarmSender.sendAlarm(alarm, subway, now);

                MockPushNotificationsService.verifyNotificationSent();
            });

            it("should send alarm if status is not normal and last sent date is not today", async () => {
                const subway = await new SubwayFixture().createSubway();
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN)
                    .withLastAlarmSent(false, NORMAL_STATUS).createAlarm();

                await alarmSender.sendAlarm(alarm, subway, now);

                MockPushNotificationsService.verifyNotificationSent();
            });

            it("should send alarm if status is not normal and last status is normal", async () => {
                const subway = await new SubwayFixture().withStatus("limited").createSubway();
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN)
                    .withLastAlarmSent(true, NORMAL_STATUS).createAlarm();

                await alarmSender.sendAlarm(alarm, subway, now);

                MockPushNotificationsService.verifyNotificationSent();
            });

            it("should send alarm if status is not normal and last status is not normal", async () => {
                const subway = await new SubwayFixture().createSubway();
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent(true, "limited").createAlarm();

                await alarmSender.sendAlarm(alarm, subway, now);

                MockPushNotificationsService.verifyNotificationSent();
            });

        });

        context("conditions to not send alarm", () => {

            SubwayStatusHelper.NORMAL_STATUS_OPTIONS.forEach(status => {
                it(`should not send alarm if status is normal '${status}' and last sent date is not today`, async () => {
                    const subway = await new SubwayFixture().withStatus(status).createSubway();
                    const alarm = await new AlarmFixture().withSubway(subway)
                        .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent(false).createAlarm();

                    await alarmSender.sendAlarm(alarm, subway, now);

                    MockPushNotificationsService.verifyNoNotificationSent();
                });

                it(`should not send alarm if status is normal '${status}' and last sent status is empty`, async () => {
                    const subway = await new SubwayFixture().withStatus(status).createSubway();
                    const alarm = await new AlarmFixture().withSubway(subway)
                        .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent(true, '').createAlarm();

                    await alarmSender.sendAlarm(alarm, subway, now);

                    MockPushNotificationsService.verifyNoNotificationSent();
                });

                SubwayStatusHelper.NORMAL_STATUS_OPTIONS.forEach(otherStatus => {
                    it(`should not send alarm if status is normal '${status}' and last sent status is other normal status '${otherStatus}'`, async () => {
                        const subway = await new SubwayFixture().withStatus(status).createSubway();
                        const alarm = await new AlarmFixture().withSubway(subway)
                            .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent(true, otherStatus).createAlarm();

                        await alarmSender.sendAlarm(alarm, subway, now);

                        MockPushNotificationsService.verifyNoNotificationSent();
                    });
                });
            });

            it("should not send alarm if is for other subway", async () => {
                const subway = await new SubwayFixture().createSubway();
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent(true).createAlarm();

                const otherSubway = await new SubwayFixture().withLine("other").createSubway();

                await alarmSender.sendAlarm(alarm, otherSubway, now);

                MockPushNotificationsService.verifyNoNotificationSent();
            });
        });

        context("notifications", () => {

            let subway: Subway;
            beforeEach(async () => {
                subway = await new SubwayFixture().createSubway();
            });

            it("should send notification with correct data", async () => {
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent().createAlarm();

                await alarmSender.sendAlarm(alarm, subway, now);

                const notification = MockPushNotificationsService.getLastNotificationSent();

                expect(notification.notification?.title).to.eq(AlarmNotification.TITLE_PREFIX + subway.line);
                expect(notification.notification?.body).to.eq(subway.status);
                expect(notification.notification?.imageUrl).to.eq(subway.icon);
            });

            it("should send notification with correct token", async () => {
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent().createAlarm();

                await alarmSender.sendAlarm(alarm, subway, now);

                const notification = MockPushNotificationsService.getLastNotificationSent();

                expect(notification).to.have.property("token", NOTIFICATIONS_TOKEN);
            });

            it("should not send notification without token", async () => {
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken("").withLastAlarmSent().createAlarm();

                await alarmSender.sendAlarm(alarm, subway, now);

                MockPushNotificationsService.verifyNoNotificationSent();
            });

        });

        context("update last alarm sent", () => {

            let alarmService: AlarmService;
            beforeEach(() => {
                alarmService = Container.get(AlarmService);
            });

            const OLD_STATUS = "old status";
            const NEW_STATUS = "new status";

            it("when alarm sent should set new last status", async () => {
                const subway = await new SubwayFixture().withStatus(NEW_STATUS).createSubway();
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent(true, OLD_STATUS).createAlarm();

                await alarmSender.sendAlarm(alarm, subway, now);

                const result = await alarmService.get(alarm.id, alarm.owner);
                expect(result?.getSubwayAlarm(subway)?.lastAlarmSent.status).to.eq(NEW_STATUS);
            });

            it("when alarm not sent should set new last status", async () => {
                const subway = await new SubwayFixture().withStatus(NORMAL_STATUS).createSubway();
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent(false, OLD_STATUS).createAlarm();

                await alarmSender.sendAlarm(alarm, subway, now);

                const result = await alarmService.get(alarm.id, alarm.owner);
                expect(result?.getSubwayAlarm(subway)?.lastAlarmSent.status).to.eq(NORMAL_STATUS);
            });

            it("when alarm sent should set new last date", async () => {
                const subway = await new SubwayFixture().withStatus(NEW_STATUS).createSubway();
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent(false, OLD_STATUS).createAlarm();
                const lastSentDate = alarm.getSubwayAlarm(subway)?.lastAlarmSent.date as Date;

                await alarmSender.sendAlarm(alarm, subway, now);

                const result = await alarmService.get(alarm.id, alarm.owner);
                expect(result?.getSubwayAlarm(subway)?.lastAlarmSent.date).to.be.greaterThan(lastSentDate);
            });

            it("when alarm not sent should set new last date", async () => {
                const subway = await new SubwayFixture().withStatus(NORMAL_STATUS).createSubway();
                const alarm = await new AlarmFixture().withSubway(subway)
                    .withOwnerFirebaseToken(NOTIFICATIONS_TOKEN).withLastAlarmSent(false, OLD_STATUS).createAlarm();
                const lastSentDate = alarm.getSubwayAlarm(subway)?.lastAlarmSent.date as Date;

                await alarmSender.sendAlarm(alarm, subway, now);

                const result = await alarmService.get(alarm.id, alarm.owner);
                expect(result?.getSubwayAlarm(subway)?.lastAlarmSent.date).to.be.greaterThan(lastSentDate);
            });

        });

    });

});
