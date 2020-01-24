import {Service} from "typedi";
import {Request, Response} from "express";
import {SubwayStatusUpdater} from "./SubwayStatusUpdater";

@Service()
export class SubwayStatusUpdaterController {

    public constructor(private service: SubwayStatusUpdater) {
    }

    public async updateSubwayStatus(_req: Request, res: Response): Promise<void> {
        this.service.updateSubwayStatus(); // No await. Should be handled in background.
        res.send();
    }

}