export enum SubwayStatus {
    Normal = "Normal",
    Limited = "Limited",
    Closed = "Closed"
}

export class SubwayStatusHelper {

    public static readonly NORMAL_STATUS_MESSAGE = "Normal";

    public static readonly NORMAL_STATUS_OPTIONS = ["normal", "habitual", "completo"];
    private static readonly LIMITED_STATUS_OPTIONS = ["limitado", "demora", "no se detienen"];

    public static getSubwayStatus(status: string): SubwayStatus {
        const currentStatus = status.toLowerCase();

        if (this.checkStatus(currentStatus, this.NORMAL_STATUS_OPTIONS)) {
            return SubwayStatus.Normal;
        }

        if (this.checkStatus(currentStatus, this.LIMITED_STATUS_OPTIONS)) {
            return SubwayStatus.Limited;
        }

        return SubwayStatus.Closed;
    }

    private static checkStatus(currentStatus: string, options: string[]): boolean {
        let found = false;
        options.forEach(option => {
            if (currentStatus.includes(option)) {
                found = true;
            }
        });

        return found;
    }
}