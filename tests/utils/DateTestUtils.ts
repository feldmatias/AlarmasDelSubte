import moment, {Moment} from "moment";
import {Config} from "../../config/config";

const TIME_FORMAT = 'HH:mm';
const DAY_FORMAT = 'dddd';

const MOCK_DATE = "2020-01-08";
const MOCK_TIME = "14:30";


export class DateTestUtils {

    public static now(): Moment {
        return moment(MOCK_DATE + " " + MOCK_TIME)
            .utcOffset(Config.alarms.utcOffset, true);
    }

    public static afterTime(time: string): Moment {
        return moment(MOCK_DATE + " " + time)
            .utcOffset(Config.alarms.utcOffset, true)
            .add({minutes: 5});
    }

    public static beforeTime(time: string): Moment {
        return moment(MOCK_DATE + " " + time)
            .utcOffset(Config.alarms.utcOffset, true)
            .subtract({minutes: 5});
    }

    public static tomorrowDay(): string {
        return DateTestUtils.now().add({day: 1}).format(DAY_FORMAT);
    }

    public static yesterdayDay(): string {
        return DateTestUtils.now().add({day: 1}).format(DAY_FORMAT);
    }

    public static getTimeRangeWithNowInside(): Array<string> {
        const now = DateTestUtils.now();
        const start = now.clone().subtract({hour: 1}).format(TIME_FORMAT);
        const end = now.clone().add({hour: 1}).format(TIME_FORMAT);
        const today = now.format(DAY_FORMAT);

        return [start, end, today];
    }

    public static getTimeRangeBeforeNow(): Array<string> {
        const now = DateTestUtils.now();
        const start = now.clone().subtract({hour: 1}).format(TIME_FORMAT);
        const end = now.clone().subtract({minute: 1}).format(TIME_FORMAT);
        const today = now.format(DAY_FORMAT);

        return [start, end, today];
    }

    public static getTimeRangeAfterNow(): Array<string> {
        const now = DateTestUtils.now();
        const start = now.clone().add({minute: 1}).format(TIME_FORMAT);
        const end = now.clone().add({hour: 1}).format(TIME_FORMAT);
        const today = now.format(DAY_FORMAT);

        return [start, end, today];
    }
}