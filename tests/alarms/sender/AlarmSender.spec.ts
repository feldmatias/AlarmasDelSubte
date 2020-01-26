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

        context("conditions to send alarm", () => {

            SubwayStatusHelper.NORMAL_STATUS_OPTIONS.forEach(status => {
                it(`should send alarm if status is normal '${status}' and last sent date is today`, async () => {
                    const subway = await SubwayFixture.createSubway("subway", status);
                    const alarm = await AlarmFixture.createAlarmWithLastAlarmSentAndNotificationToken(subway, NOTIFICATIONS_TOKEN, true);

                    await alarmSender.sendAlarm(alarm, subway, now);

                    MockPushNotificationsService.verifyNotificationSent();
                });
            });

            it("should send alarm if status is not normal and last sent date is today", async () => {
                const subway = await SubwayFixture.createSubway();
                const alarm = await AlarmFixture.createAlarmWithLastAlarmSentAndNotificationToken(subway, NOTIFICATIONS_TOKEN, true);

                await alarmSender.sendAlarm(alarm, subway, now);

                MockPushNotificationsService.verifyNotificationSent();
            });

            it("should send alarm if status is not normal and last sent date is not today", async () => {
                const subway = await SubwayFixture.createSubway();
                const alarm = await AlarmFixture.createAlarmWithLastAlarmSentAndNotificationToken(subway, NOTIFICATIONS_TOKEN, false);

                await alarmSender.sendAlarm(alarm, subway, now);

                MockPushNotificationsService.verifyNotificationSent();
            });

        });

        context("conditions to not send alarm", () => {

            SubwayStatusHelper.NORMAL_STATUS_OPTIONS.forEach(status => {
                it(`should not send alarm if status is normal '${status}' and last sent date is not today`, async () => {
                    const subway = await SubwayFixture.createSubway("subway", status);
                    const alarm = await AlarmFixture.createAlarmWithLastAlarmSentAndNotificationToken(subway, NOTIFICATIONS_TOKEN, false);

                    await alarmSender.sendAlarm(alarm, subway, now);

                    MockPushNotificationsService.verifyNoNotificationSent();
                });
            });

            it("should not send alarm if is for other subway", async () => {
                const subway = await SubwayFixture.createSubway();
                const alarm = await AlarmFixture.createAlarmWithLastAlarmSentAndNotificationToken(subway, NOTIFICATIONS_TOKEN, true);

                const otherSubway = await SubwayFixture.createSubway("other");

                await alarmSender.sendAlarm(alarm, otherSubway, now);

                MockPushNotificationsService.verifyNoNotificationSent();
            });
        });

        context("notifications", () => {

            let subway: Subway;
            beforeEach(async () => {
                subway = await SubwayFixture.createSubway();
            });

            it("should send notification with correct data", async () => {
                const alarm = await AlarmFixture.createAlarmWithLastAlarmSentAndNotificationToken(subway, NOTIFICATIONS_TOKEN);

                await alarmSender.sendAlarm(alarm, subway, now);

                const notification = MockPushNotificationsService.getLastNotificationSent();

                expect(notification.notification?.title).to.eq(AlarmNotification.TITLE_PREFIX + subway.line);
                expect(notification.notification?.body).to.eq(subway.status);
                expect(notification.notification?.imageUrl).to.eq(subway.icon);
            });

            it("should send notification with correct token", async () => {
                const alarm = await AlarmFixture.createAlarmWithLastAlarmSentAndNotificationToken(subway, NOTIFICATIONS_TOKEN);

                await alarmSender.sendAlarm(alarm, subway, now);

                const notification = MockPushNotificationsService.getLastNotificationSent();

                expect(notification).to.have.property("token", NOTIFICATIONS_TOKEN);
            });

            it("should not send notification without token", async () => {
                const alarm = await AlarmFixture.createAlarmWithLastAlarmSentAndNotificationToken(subway, "");

                await alarmSender.sendAlarm(alarm, subway, now);

                MockPushNotificationsService.verifyNoNotificationSent();
            });

        });

    });

});