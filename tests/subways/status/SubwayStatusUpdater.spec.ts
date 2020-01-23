import {Container} from "typedi";
import {SubwayStatusUpdater} from "../../../src/subways/status/SubwayStatusUpdater";
import {expect} from "chai";
import MockApiService from "../../utils/MockApiService";
import {SubwayFixture} from "../SubwayFixture";
import {SubwayService} from "../../../src/subways/SubwayService";
import {Config} from "../../../config/config";

const SUBWAY_NEW_STATUS = "new updated status";

/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-explicit-any */
// Because i can't change external api
function generateApiResponse(subways: string[]): any {
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
                            text: SUBWAY_NEW_STATUS
                        }]
                    }
                }
            });
    });
    return apiResponse;
}
/* eslint-enable @typescript-eslint/camelcase, @typescript-eslint/no-explicit-any */

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

            MockApiService.mockGetRequest(apiUrl, generateApiResponse([subway.line]));

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(subways[0].status).to.eq(SUBWAY_NEW_STATUS);
        });

    });

});