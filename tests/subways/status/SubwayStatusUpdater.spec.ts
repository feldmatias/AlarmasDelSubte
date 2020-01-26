import {Container} from "typedi";
import {SubwayStatusUpdater} from "../../../src/subways/status/SubwayStatusUpdater";
import {expect} from "chai";
import MockApiService from "../../utils/MockApiService";
import {SubwayFixture} from "../SubwayFixture";
import {SubwayService} from "../../../src/subways/SubwayService";
import {Config} from "../../../config/config";
import {Subway} from "../../../src/subways/entities/Subway";
import {SubwayStatusHelper} from "../../../src/subways/SubwayStatus";

const SUBWAY_NEW_STATUS = "new updated status";

/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-explicit-any */

// Because i can't change external api
function subwaysApiResponse(subways: string[]): any {
    const apiResponse = {entity: Array<any>()};

    subways.forEach(subway => {
        apiResponse.entity.push(
            {
                alert: {
                    informed_entity: [{
                        route_id: "Linea" + subway
                    }],
                    description_text: {
                        translation: [{
                            language: Config.subways.language,
                            text: SUBWAY_NEW_STATUS + subway
                        }]
                    }
                }
            });
    });
    return apiResponse;
}

/* eslint-enable @typescript-eslint/camelcase, @typescript-eslint/no-explicit-any */

function findSubwayByLine(subways: Subway[], line: string): Subway | undefined {
    return subways.find(subway => subway.line == line);
}

describe("Subway Status Updater", () => {

    let statusUpdater: SubwayStatusUpdater;
    let service: SubwayService;
    const apiUrl = Config.subways.realTimeUrl;

    beforeEach(async () => {
        MockApiService.mock();
        statusUpdater = Container.get(SubwayStatusUpdater);
        service = Container.get(SubwayService);
    });

    afterEach(() => {
        MockApiService.reset();
    });

    context("update subway status", () => {

        it("should update subway status when api return status", async () => {
            const subway = await SubwayFixture.createSubway();

            MockApiService.mockGetRequest(apiUrl, subwaysApiResponse([subway.line]));

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(subways[0].status).to.eq(SUBWAY_NEW_STATUS + subway.line);
        });

        it("should update all subways status when api return status", async () => {
            const subway1 = await SubwayFixture.createSubway("1");
            const subway2 = await SubwayFixture.createSubway("2");

            MockApiService.mockGetRequest(apiUrl, subwaysApiResponse([subway1.line, subway2.line]));

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(findSubwayByLine(subways, subway1.line)?.status).to.eq(SUBWAY_NEW_STATUS + subway1.line);
            expect(findSubwayByLine(subways, subway2.line)?.status).to.eq(SUBWAY_NEW_STATUS + subway2.line);
        });

        it("should update all subways status when api return status no matter the order", async () => {
            const subway1 = await SubwayFixture.createSubway("1");
            const subway2 = await SubwayFixture.createSubway("2");
            const subway3 = await SubwayFixture.createSubway("3");

            MockApiService.mockGetRequest(apiUrl, subwaysApiResponse([subway2.line, subway1.line, subway3.line]));

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(findSubwayByLine(subways, subway1.line)?.status).to.eq(SUBWAY_NEW_STATUS + subway1.line);
            expect(findSubwayByLine(subways, subway2.line)?.status).to.eq(SUBWAY_NEW_STATUS + subway2.line);
            expect(findSubwayByLine(subways, subway3.line)?.status).to.eq(SUBWAY_NEW_STATUS + subway3.line);
        });

        it("should update all subways status to normal when api returns empty", async () => {
            const subway1 = await SubwayFixture.createSubway("1");
            const subway2 = await SubwayFixture.createSubway("2");

            MockApiService.mockGetRequest(apiUrl, subwaysApiResponse([]));

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(findSubwayByLine(subways, subway1.line)?.status).to.eq(SubwayStatusHelper.NORMAL_STATUS_MESSAGE);
            expect(findSubwayByLine(subways, subway2.line)?.status).to.eq(SubwayStatusHelper.NORMAL_STATUS_MESSAGE);
        });

        it("should update subway status when api returns it, and subway status to normal when not", async () => {
            const subway1 = await SubwayFixture.createSubway("1");
            const subway2 = await SubwayFixture.createSubway("2");

            MockApiService.mockGetRequest(apiUrl, subwaysApiResponse([subway1.line]));

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(findSubwayByLine(subways, subway1.line)?.status).to.eq(SUBWAY_NEW_STATUS + subway1.line);
            expect(findSubwayByLine(subways, subway2.line)?.status).to.eq(SubwayStatusHelper.NORMAL_STATUS_MESSAGE);
        });

        it("should not fail when api returns status for unknown subway", async () => {
            const subway = await SubwayFixture.createSubway();

            MockApiService.mockGetRequest(apiUrl, subwaysApiResponse([subway.line, "othersubway"]));

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(findSubwayByLine(subways, subway.line)?.status).to.eq(SUBWAY_NEW_STATUS + subway.line);
        });

        it("should not update status if it is in another language", async () => {
            const subway = await SubwayFixture.createSubway();

            const apiResponse = subwaysApiResponse([subway.line]);
            apiResponse.entity[0].alert.description_text.translation[0].language = "other language";

            MockApiService.mockGetRequest(apiUrl, apiResponse);

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(findSubwayByLine(subways, subway.line)?.status).to.eq(SubwayStatusHelper.NORMAL_STATUS_MESSAGE);
        });

        it("should not update if alert comes without subway line", async () => {
            const subway = await SubwayFixture.createSubway();

            const apiResponse = subwaysApiResponse([subway.line]);
            apiResponse.entity[0].alert["informed_entity"] = [];

            MockApiService.mockGetRequest(apiUrl, apiResponse);

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(findSubwayByLine(subways, subway.line)?.status).to.eq(SubwayStatusHelper.NORMAL_STATUS_MESSAGE);
        });

        it("should not update if alert comes without subway status", async () => {
            const subway = await SubwayFixture.createSubway();

            const apiResponse = subwaysApiResponse([subway.line]);
            apiResponse.entity[0].alert["description_text"].translation = [];

            MockApiService.mockGetRequest(apiUrl, apiResponse);

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(findSubwayByLine(subways, subway.line)?.status).to.eq(SubwayStatusHelper.NORMAL_STATUS_MESSAGE);
        });

        it("should do nothing when api fails", async () => {
            const subway = await SubwayFixture.createSubway();

            MockApiService.mockGetRequestWithError(apiUrl);

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(subways[0].status).to.eq(subway.status);
        });

        it("should update subway updatedAt when api return status", async () => {
            const datePast = new Date();
            datePast.setHours(datePast.getHours() - 5);
            const subway = await SubwayFixture.createSubwayWithUpdatedAt("1", datePast);

            MockApiService.mockGetRequest(apiUrl, subwaysApiResponse([subway.line]));

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(subways[0].updatedAt).to.be.greaterThan(datePast);
        });

    });

});