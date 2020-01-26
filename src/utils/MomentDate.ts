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
        const otherMoment = moment(other).utcOffset(Config.alarms.utcOffset);
        return this.momentDate.diff(otherMoment, 'hours');
    }

    public isSameDate(other: Date): boolean {
        const otherMoment = moment(other).utcOffset(Config.alarms.utcOffset);
        return this.momentDate.isSame(otherMoment, 'day');
    }
}