import {Service} from "typedi";
import {Request, Response} from "express";
import {SubwayAlarmManager} from "./SubwayAlarmManager";
import {MomentDate} from "../../utils/MomentDate";

@Service()
export class SubwayAlarmController {

    public constructor(private service: SubwayAlarmManager) {
    }

    public async sendAlarms(_req: Request, res: Response): Promise<void> {
        this.service.sendAlarms(new MomentDate()); // No await. Should be handled in background.
        res.send();
    }

}