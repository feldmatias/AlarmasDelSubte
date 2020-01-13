import {Container} from "typedi";
import {SubwayService} from "../../src/subways/SubwayService";
import { expect } from "chai";
import {SubwayFixture} from "./SubwayFixture";

describe("Subway Service", () => {

    let service: SubwayService;

    beforeEach(async () => {
        service = Container.get(SubwayService);
    });

    context("getAll", () => {

        it("returns empty list if no subways", async () => {
            const subways = await service.getAll();
            expect(subways).to.have.length(0);
        });

        it("returns 1 subway if exists", async () => {
            await SubwayFixture.createSubway();

            const subways = await service.getAll();
            expect(subways).to.have.length(1);
        });

        it("returns 2 subways if exist", async () => {
            await SubwayFixture.createSubway("A");
            await SubwayFixture.createSubway("B");

            const subways = await service.getAll();
            expect(subways).to.have.length(2);
        });

        it("returns n subways if exist", async () => {
            const count = 10;

            for (let i = 0; i < count; i++) {
                await SubwayFixture.createSubway(i.toString());
            }

            const subways = await service.getAll();

            let lines = new Array<string>();
            for (let i = 0; i < count; i++) {
                lines.push(subways[i].line);
            }

            for (let i = 0; i < count; i++) {
                expect(lines).to.include(i.toString());
            }
        });

    });

});