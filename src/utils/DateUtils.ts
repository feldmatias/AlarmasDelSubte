export class DateUtils {

    public static readonly DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    public static dayToNumber(day: string): number {
        return this.DAYS.indexOf(day);
    }

}
