import {BeforeInsert, Column} from "typeorm";
import moment from "moment";
import {Config} from "../../../config/config";
import {SubwayStatus, SubwayStatusHelper} from "../../subways/SubwayStatus";

export class LastAlarmSent {

    @Column({default: ""})
    public status!: string;

    @Column()
    public date!: Date;

    @BeforeInsert()
    private initializeDate(): void {
        if (!this.date) {
            this.updateDate();
        }
    }
    private updateDate(): void {
        // Workaround to save dates in utc offset instead of utc
        this.date = moment().utcOffset(Config.alarms.utcOffset).utc(true).toDate();
    }

    public setStatus(status: string): void {
        this.status = status;
        this.updateDate();
    }

    public getStatusType(): SubwayStatus {
        return SubwayStatusHelper.getSubwayStatus(this.status);
    }
}