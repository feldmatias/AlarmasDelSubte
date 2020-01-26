import * as admin from "firebase-admin";
import {Container} from "typedi";
import Messaging = admin.messaging.Messaging;
import {Config} from "../../config/config";

admin.initializeApp({
    credential: admin.credential.cert(process.cwd() + "/config/push_notifications/" + Config.notifications.configFile)
});

export type FirebaseNotifications = Messaging;

export const PUSH_NOTIFICATIONS_DI = "Firebase";
Container.set(PUSH_NOTIFICATIONS_DI, admin.messaging());