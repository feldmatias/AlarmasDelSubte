import {Application} from "express";
import {Container} from "typedi";
import {SubwayStatusUpdaterController} from "../subways/status/SubwayStatusUpdaterController";

export const registerCommandRoutes = (app: Application): void => {

    // Route for updating subways status
    app.get("/commands/subways/update",
        Container.get(SubwayStatusUpdaterController).updateSubwayStatus);
};