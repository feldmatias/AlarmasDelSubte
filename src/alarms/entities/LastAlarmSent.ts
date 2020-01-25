import {Column, UpdateDateColumn} from "typeorm";

export class LastAlarmSent {

    @Column({default: ""})
    public status!: string;

    @UpdateDateColumn()
    public date!: Date;

}