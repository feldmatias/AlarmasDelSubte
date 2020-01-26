import {Column} from "typeorm";

export class LastAlarmSent {

    @Column({default: ""})
    public status!: string;

    @Column({default: () => `datetime('now')`})
    public date!: Date;

}