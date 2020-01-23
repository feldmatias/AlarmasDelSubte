import {Container} from "typedi";
import {SubwayStatusUpdater} from "../../../src/subways/status/SubwayStatusUpdater";
import {expect} from "chai";
import MockApiService from "../../utils/MockApiService";
import {SubwayFixture} from "../SubwayFixture";
import {SubwayService} from "../../../src/subways/SubwayService";
import {Config} from "../../../config/config";
import {Subway} from "../../../src/subways/entities/Subway";

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
                        route_id: subway
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

    });

});