import {expect} from "chai";
import {GraphQL} from "../../graphql/GraphQL";

describe('GraphQL', () => {

    it('should create schema', async () => {
        const schema = await GraphQL.createSchema();
        expect(schema).to.not.be.undefined;
    });

});
