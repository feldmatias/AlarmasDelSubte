import {anyOfClass, capture, instance, mock, verify} from "ts-mockito";
import {mockRequest, mockResponse} from "mock-req-res";
import {expect} from "chai";
import {SubwayAlarmManager} from "../../../src/alarms/sender/SubwayAlarmManager";
import {SubwayAlarmController} from "../../../src/alarms/sender/SubwayAlarmController";
import {MomentDate} from "../../../src/utils/MomentDate";
import moment from "moment";

describe("Subway Alarm Controller", () => {

    let service: SubwayAlarmManager;
    let controller: SubwayAlarmController;
    beforeEach(() => {
        service = mock(SubwayAlarmManager);
        controller = new SubwayAlarmController(instance(service));
    });

    context("send alarms", () => {

        it("should call service", async () => {
            await controller.sendAlarms(mockRequest(), mockResponse());

            verify(service.sendAlarms(anyOfClass(MomentDate))).called();
        });

        it("should call send in response", async () => {
            const response = mockResponse();
            await controller.sendAlarms(mockRequest(), response);

            expect(response.send.called).to.be.true;
        });

        it("should call service with now moment", async () => {
            await controller.sendAlarms(mockRequest(), mockResponse());

            const [momentDate] = capture(service.sendAlarms).first();
            const date = `${momentDate.date()} ${momentDate.time()}`;

            const now = new MomentDate();
            const nowDate = `${now.date()} ${now.time()}`;

            expect(moment(nowDate).diff(moment(date), "minutes")).to.eq(0);
        });
    });

});