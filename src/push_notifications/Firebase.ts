import * as admin from "firebase-admin";
import {Container} from "typedi";
import Messaging = admin.messaging.Messaging;

admin.initializeApp({
    credential: admin.credential.cert(process.cwd() + "/config/push_notifications/firebase_config.json")
});

export type FirebaseNotifications = Messaging;

export const PUSH_NOTIFICATIONS_DI = "Firebase";
Container.set(PUSH_NOTIFICATIONS_DI, admin.messaging());