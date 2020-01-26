import {Application, Request, Response} from "express";
import {Container} from "typedi";
import {SubwayStatusUpdaterController} from "../subways/status/SubwayStatusUpdaterController";
import {SubwayAlarmController} from "../alarms/sender/SubwayAlarmController";

export const registerCommandRoutes = (app: Application): void => {

    // Route for updating subways status
    app.get("/commands/subways/update", (req: Request, res: Response): void => {
        Container.get(SubwayStatusUpdaterController).updateSubwayStatus(req, res);
    });

    // Route for sending alarms
    app.get("/commands/alarms/send", (req: Request, res: Response): void => {
        Container.get(SubwayAlarmController).sendAlarms(req, res);
    });
};