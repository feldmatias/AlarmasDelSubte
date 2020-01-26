import {Container} from "typedi";
import {anything, capture, instance, mock, reset, verify} from "ts-mockito";
import {FirebaseNotifications, PUSH_NOTIFICATIONS_DI} from "../../src/push_notifications/Firebase";
import admin from "firebase-admin";
import Message = admin.messaging.Message;

class MockPushNotificationsService {

    private firebaseMock: FirebaseNotifications = mock<FirebaseNotifications>();
    private realFirebase?: FirebaseNotifications;

    public mock(): void {
        this.realFirebase = Container.get(PUSH_NOTIFICATIONS_DI);
        Container.set(PUSH_NOTIFICATIONS_DI, instance(this.firebaseMock));
    }

    public reset(): void {
        reset(this.firebaseMock);
        Container.set(PUSH_NOTIFICATIONS_DI, this.realFirebase);
    }

    public getLastNotificationSent(): Message {
        this.verifyNotificationSent();
        return capture(this.firebaseMock.send).last()[0];
    }

    public verifyNotificationSent(): void {
        verify(this.firebaseMock.send(anything())).called();
    }

    public verifyNoNotificationSent(): void {
        verify(this.firebaseMock.send(anything())).never();
    }
}

export default new MockPushNotificationsService();