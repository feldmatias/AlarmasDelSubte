import {instance, mock, verify} from "ts-mockito";
import {SubwayStatusUpdater} from "../../../src/subways/status/SubwayStatusUpdater";
import {SubwayStatusUpdaterController} from "../../../src/subways/status/SubwayStatusUpdaterController";
import {mockRequest, mockResponse} from "mock-req-res";
import {expect} from "chai";

describe("Subway Status Updater Controller", () => {

    let service: SubwayStatusUpdater;
    let controller: SubwayStatusUpdaterController;
    beforeEach(() => {
        service = mock(SubwayStatusUpdater);
        controller = new SubwayStatusUpdaterController(instance(service));
    });

    context("update subway status", () => {
        it("should call service", async () => {
            await controller.updateSubwayStatus(mockRequest(), mockResponse());

            verify(service.updateSubwayStatus()).called();
        });

        it("should call send in response", async () => {
            const response = mockResponse();
            await controller.updateSubwayStatus(mockRequest(), response);

            expect(response.send.called).to.be.true;
        });
    });

});