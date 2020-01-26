import {Column} from "typeorm";
import moment from "moment";
import {Config} from "../../../config/config";

export class LastAlarmSent {

    @Column({default: ""})
    public status!: string;

    @Column()
    public date!: Date;

    public constructor() {
        this.updateDate();
    }

    private updateDate(): void {
        // Workaround to save dates in utc offset instead of utc
        this.date = moment().utcOffset(Config.alarms.utcOffset).utc(true).toDate();
    }
}