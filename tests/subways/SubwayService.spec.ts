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
            await new SubwayFixture().createSubway();

            const subways = await service.getAll();
            expect(subways).to.have.length(1);
        });

        it("returns 2 subways if exist", async () => {
            await new SubwayFixture().withLine("1").createSubway();
            await new SubwayFixture().withLine("2").createSubway();

            const subways = await service.getAll();
            expect(subways).to.have.length(2);
        });

        it("returns n subways if exist", async () => {
            const count = 10;

            for (let i = 0; i < count; i++) {
                await new SubwayFixture().withLine(i.toString()).createSubway();
            }

            const subways = await service.getAll();

            const lines = new Array<string>();
            for (let i = 0; i < count; i++) {
                lines.push(subways[i].line);
            }

            for (let i = 0; i < count; i++) {
                expect(lines).to.include(i.toString());
            }
        });

        it("returns 3 subways ordered by line", async () => {
            await new SubwayFixture().withLine("2").createSubway();
            await new SubwayFixture().withLine("1").createSubway();
            await new SubwayFixture().withLine("3").createSubway();

            const subways = await service.getAll();

            expect(subways[0].line).to.eq("1");
            expect(subways[1].line).to.eq("2");
            expect(subways[2].line).to.eq("3");
        });

    });

});