import {Inject, Service} from "typedi";
import {Notification} from "./Notification";
import {FirebaseNotifications, PUSH_NOTIFICATIONS_DI} from "./Firebase";

@Service()
export class PushNotificationService {

    public constructor(@Inject(PUSH_NOTIFICATIONS_DI) private firebase: FirebaseNotifications) {
    }

    public async sendNotification(notification: Notification, token: string): Promise<void> {
        if (!token) {
            return;
        }

        // No await. Send notification in background.
        this.firebase.send({
            notification: {
                title: notification.title,
                body: notification.body,
                imageUrl: notification.image
            },
            token: token
        });
    }

}