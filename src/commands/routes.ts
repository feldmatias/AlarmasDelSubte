import {Application, Request, Response} from "express";
import {Container} from "typedi";
import {SubwayStatusUpdaterController} from "../subways/status/SubwayStatusUpdaterController";

export const registerCommandRoutes = (app: Application): void => {

    // Route for updating subways status
    app.get("/commands/subways/update", (req: Request, res: Response): void => {
        Container.get(SubwayStatusUpdaterController).updateSubwayStatus(req, res);
    });
};