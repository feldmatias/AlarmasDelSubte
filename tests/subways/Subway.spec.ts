import {Subway} from "../../src/subways/entities/Subway";
import {expect} from "chai";
import {SubwayStatus} from "./SubwayStatus";

describe("Subway", () => {

    context("Status type", () => {

        ["Normal", "Habitual", "Completo"].forEach(status => {
            it(`should be NORMAL when status is '${status}'`, () => {
                let subway = new Subway();
                subway.status = status;

                expect(subway.getStatusType()).to.eq(SubwayStatus.Normal);
            });

            it(`should be NORMAL when status contains '${status}' in the middle`, () => {
                let subway = new Subway();
                subway.status = `some ${status} status`;

                expect(subway.getStatusType()).to.eq(SubwayStatus.Normal);
            });

            it(`should be NORMAL when status starts with '${status}' in the middle`, () => {
                let subway = new Subway();
                subway.status = `${status} status`;

                expect(subway.getStatusType()).to.eq(SubwayStatus.Normal);
            });

            it(`should be NORMAL when status ends with '${status}' in the middle`, () => {
                let subway = new Subway();
                subway.status = `some ${status}`;

                expect(subway.getStatusType()).to.eq(SubwayStatus.Normal);
            });
        });

        ["Limitado", "Demora", "No Se Detienen"].forEach(status => {
            it(`should be LIMITED when status is '${status}'`, () => {
                let subway = new Subway();
                subway.status = status;

                expect(subway.getStatusType()).to.eq(SubwayStatus.Limited);
            });

            it(`should be LIMITED when status contains '${status}' in the middle`, () => {
                let subway = new Subway();
                subway.status = `some ${status} status`;

                expect(subway.getStatusType()).to.eq(SubwayStatus.Limited);
            });

            it(`should be LIMITED when status starts with '${status}' in the middle`, () => {
                let subway = new Subway();
                subway.status = `${status} status`;

                expect(subway.getStatusType()).to.eq(SubwayStatus.Limited);
            });

            it(`should be LIMITED when status ends with '${status}' in the middle`, () => {
                let subway = new Subway();
                subway.status = `some ${status}`;

                expect(subway.getStatusType()).to.eq(SubwayStatus.Limited);
            });
        });

        it("should be CLOSED when status is unknown", () => {
            let subway = new Subway();
            subway.status = "";

            expect(subway.getStatusType()).to.eq(SubwayStatus.Closed);
        });

        it("should be CLOSED when status is not an expected option", () => {
            let subway = new Subway();
            subway.status = "some status";

            expect(subway.getStatusType()).to.eq(SubwayStatus.Closed);
        });

    });
});