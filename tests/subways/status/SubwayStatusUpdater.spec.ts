import {Container} from "typedi";
import {SubwayStatusUpdater} from "../../../src/subways/status/SubwayStatusUpdater";
import {expect} from "chai";
import MockApiService from "../../utils/MockApiService";
import {SubwayFixture} from "../SubwayFixture";
import {SubwayService} from "../../../src/subways/SubwayService";
import {Config} from "../../../config/config";

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

        const apiResponse = {
            entity: [{
                alert: {
                    informed_entity: [{
                        route_id: "subway"
                    }],
                    description_text: {
                        translation: [{
                            language: "es",
                            text: "new status"
                        }]
                    }
                }
            }]
        };

        it("should update subway status when api return status", async () => {
            const subway = await SubwayFixture.createSubway("subway");

            MockApiService.mockGetRequest(apiUrl, apiResponse);

            await statusUpdater.updateSubwayStatus();

            const subways = await service.getAll();
            expect(subways[0].line).to.eq(subway.line);
            expect(subways[0].status).to.eq("new status");
        });

    });

});