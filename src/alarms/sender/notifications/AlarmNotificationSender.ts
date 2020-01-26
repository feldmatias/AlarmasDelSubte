import {Service} from "typedi";
import {PushNotificationService} from "../../../push_notifications/PushNotificationService";
import {Alarm} from "../../entities/Alarm";
import {Subway} from "../../../subways/entities/Subway";
import {AlarmNotification} from "./AlarmNotification";

@Service()
export class AlarmNotificationSender {

    public constructor(private pushNotificationsService: PushNotificationService) {
    }

    public async sendNotification(alarm: Alarm, subway: Subway): Promise<void> {
        const token = alarm.owner.firebaseToken;
        const notification = new AlarmNotification(subway);

        if (token) {
            await this.pushNotificationsService.sendNotification(notification, token);
        }
    }

}