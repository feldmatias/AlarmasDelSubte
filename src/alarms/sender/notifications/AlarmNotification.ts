import {Notification} from "../../../push_notifications/Notification";
import {Subway} from "../../../subways/entities/Subway";

export class AlarmNotification implements Notification {

    private static readonly TITLE_PREFIX = "Línea ";

    public title: string;

    public body: string;

    public image: string;

    public constructor(subway: Subway) {
        this.title = AlarmNotification.TITLE_PREFIX + subway.line;
        this.body = subway.status;
        this.image = subway.icon;
    }

}