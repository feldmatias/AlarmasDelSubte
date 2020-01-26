import moment, {Moment} from "moment";
import {Config} from "../../config/config";

export class MomentDate {

    private momentDate: Moment;

    public constructor() {
        this.momentDate = moment().utcOffset(Config.alarms.utcOffset);
    }

    public date(): string {
        return this.momentDate.format("YYYY-MM-DD");
    }

    public day(): string {
        return this.momentDate.format('dddd').toLowerCase();
    }

    public time(): string {
        return this.momentDate.format('HH:mm');
    }

    public differenceInHours(other: Date): number {
        return this.momentDate.diff(other, 'hours');
    }
}