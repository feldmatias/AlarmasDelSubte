import {instance, mock, when} from "ts-mockito";
import {SubwayService} from "../../src/subways/SubwayService";
import {SubwayResolver} from "../../src/subways/resolvers/SubwayResolver";
import {expect} from "chai";
import {Subway} from "../../src/subways/entities/Subway";

describe("Subway Resolver", () => {

    let service: SubwayService;
    let resolver: SubwayResolver;
    beforeEach(() => {
        service = mock(SubwayService);
        resolver = new SubwayResolver(instance(service));
    });

    context("getSubways", () => {

        it("should return empty array if service returns empty array", async () => {
            when(service.getAll()).thenResolve([]);

            const subways = await resolver.getSubways();

            expect(subways).to.have.length(0);
        });

        it("should return subway if service returns a subway", async () => {
            const subway = new Subway();
            subway.line = "A";
            when(service.getAll()).thenResolve([subway]);

            const subways = await resolver.getSubways();

            expect(subways).to.have.length(1);
            expect(subways[0].line).to.eq("A");
        });

        it("should return n subway if service returns n subways", async () => {
            const count = 10;
            const mock = new Array<Subway>();
            const expected = new Array<string>()

            for (let i = 0; i < count; i++) {
                const subway = new Subway();
                subway.line = i.toString();
                mock.push(subway);
                expected.push(subway.line);
            }

            when(service.getAll()).thenResolve(mock);

            const subways = await resolver.getSubways();

            expect(subways).to.have.length(count);
            for (let i = 0; i < count; i++) {
                expect(expected).to.include(subways[i].line);
            }
        });

    });

});