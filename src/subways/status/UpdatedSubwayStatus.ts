export class UpdatedSubwayStatus {
    public subwayLine: string;
    public status: string;

    public constructor(line: string, status: string) {
        this.subwayLine = line;
        this.status = status;
    }
}