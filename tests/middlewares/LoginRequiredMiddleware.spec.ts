import {Container} from "typedi";
import {LoginRequiredMiddleware} from "../../src/http/middlewares/LoginRequiredMiddleware";
import {instance, mock, when} from "ts-mockito";
import {GraphQLSchema} from "graphql/type/schema";
import {GraphQLObjectType, GraphQLResolveInfo} from "graphql";
import {NextFn} from "type-graphql/dist/interfaces/Middleware";
import {RequestContext} from "../../src/http/RequestContext";
import {ArgsDictionary} from "type-graphql";
import {expect} from "chai";
import {User} from "../../src/users/entities/User";
import {UserFixture} from "../users/UserFixture";
import {fail} from "assert";
import {ErrorHelper} from "../../src/utils/ErrorHelper";
import {constants} from "http2";

const QUERY_TYPE = new GraphQLObjectType({
    fields: {},
    name: "query"
});

const MUTATION_TYPE = new GraphQLObjectType({
    fields: {},
    name: "mutation"
});

const MIDDLEWARE_RESULT = "result";

function getMockInfo(fieldName: string, type: GraphQLObjectType): GraphQLResolveInfo {
    const mockedSchema = mock(GraphQLSchema);
    when(mockedSchema.getQueryType()).thenReturn(QUERY_TYPE);
    when(mockedSchema.getMutationType()).thenReturn(MUTATION_TYPE);

    const info = mock<GraphQLResolveInfo>();
    when(info.fieldName).thenReturn(fieldName);
    when(info.schema).thenReturn(instance(mockedSchema));
    when(info.parentType).thenReturn(type);

    return instance(info);
}

function getRequestContext(token = ""): RequestContext {
    return new class implements RequestContext {
        user?: User;

        header(header: string): string {
            if (header != constants.HTTP2_HEADER_AUTHORIZATION) {
                throw new Error("Tried to obtain invalid header. Only able to obtain header: " + constants.HTTP2_HEADER_AUTHORIZATION)
            }
            return token;
        }
    }
}

describe("Login Required Middleware", () => {

    let middleware: LoginRequiredMiddleware;
    const nextFunction: NextFn = () => Promise.resolve(MIDDLEWARE_RESULT);

    function callMiddleware(requestContext: RequestContext, info: GraphQLResolveInfo): Promise<string> {
        return middleware.use({
            args: new class implements ArgsDictionary {
            }, root: undefined, context: requestContext, info: info
        }, nextFunction);
    }

    beforeEach(() => {
        middleware = Container.get(LoginRequiredMiddleware);
    });

    context("Excluded queries or mutations", () => {

        LoginRequiredMiddleware.EXCLUDED_QUERIES.forEach(query => {
            it(`should exclude query '${query}' when operation type is query`, async () => {
                const requestContext = getRequestContext();
                const info = getMockInfo(query, QUERY_TYPE);

                const result = await callMiddleware(requestContext, info);

                expect(result).to.eq(MIDDLEWARE_RESULT);
                expect(requestContext.user).to.be.undefined;
            });

            it(`should not exclude query '${query}' when operation type is mutation`, async () => {
                const requestContext = getRequestContext();
                const info = getMockInfo(query, MUTATION_TYPE);

                await expect(callMiddleware(requestContext, info))
                    .to.eventually.be.rejectedWith(ErrorHelper.AUTHORIZATION_ERROR_MESSAGE);
            });
        });

        LoginRequiredMiddleware.EXCLUDED_MUTATIONS.forEach(mutation => {
            it(`should exclude mutation '${mutation}' when operation type is mutation`, async () => {
                const requestContext = getRequestContext();
                const info = getMockInfo(mutation, MUTATION_TYPE);

                const result = await callMiddleware(requestContext, info);

                expect(result).to.eq(MIDDLEWARE_RESULT);
                expect(requestContext.user).to.be.undefined;
            });

            it(`should not exclude mutation '${mutation}' when operation type is query`, async () => {
                const requestContext = getRequestContext();
                const info = getMockInfo(mutation, QUERY_TYPE);

                await expect(callMiddleware(requestContext, info))
                    .to.eventually.be.rejectedWith(ErrorHelper.AUTHORIZATION_ERROR_MESSAGE);
            });
        });
    });

    context("Included queries or mutations", () => {

        [QUERY_TYPE, MUTATION_TYPE].forEach(type => {
            it(`should add user to context if token is valid and operation is a ${type.name}`, async () => {
                const user = await UserFixture.createUser();
                const requestContext = getRequestContext(user.token);
                const info = getMockInfo("some query", type);

                const result = await callMiddleware(requestContext, info);

                expect(result).to.eq(MIDDLEWARE_RESULT);
                if (!requestContext.user) {
                    fail();
                }
                expect(requestContext.user.id).to.eq(user.id);
                expect(requestContext.user.token).to.eq(user.token);
            });

            it(`should raise error if token is invalid and operation is a ${type.name}`, async () => {
                const requestContext = getRequestContext("invalid token");
                const info = getMockInfo("some query", type);

                await expect(callMiddleware(requestContext, info))
                    .to.eventually.be.rejectedWith(ErrorHelper.AUTHORIZATION_ERROR_MESSAGE);
            });

            it(`should raise error if token is empty and is a ${type.name}`, async () => {
                const requestContext = getRequestContext();
                const info = getMockInfo("some query", type);

                await expect(callMiddleware(requestContext, info))
                    .to.eventually.be.rejectedWith(ErrorHelper.AUTHORIZATION_ERROR_MESSAGE);
            });
        });
    });

    context("Non query/mutation operation", () => {
        it("should exclude operation if operation is not query or mutation", async () => {
            const requestContext = getRequestContext();
            const info = getMockInfo("some query", mock<GraphQLObjectType>());

            const result = await callMiddleware(requestContext, info);

            expect(result).to.eq(MIDDLEWARE_RESULT);
            expect(requestContext.user).to.be.undefined;
        });
    });
});
