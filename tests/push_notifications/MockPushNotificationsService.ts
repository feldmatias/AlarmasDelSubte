import {Container} from "typedi";
import {instance, mock, reset} from "ts-mockito";
import {FirebaseNotifications, PUSH_NOTIFICATIONS_DI} from "../../src/push_notifications/Firebase";

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
}

export default new MockPushNotificationsService();