import {instance, mock, verify, when} from "ts-mockito";
import {Result} from "../../src/utils/Result";
import {expect} from "chai";
import {RequestContext} from "../../src/graphql/RequestContext";
import {RequestContextMock} from "../graphql/RequestContextMock";
import {PushNotificationsTokenService} from "../../src/push_notifications/PushNotificationsTokenService";
import {PushNotificationsTokenResolver} from "../../src/push_notifications/resolvers/PushNotificationsTokenResolver";
import PushNotificationsErrorHelper from "../../src/push_notifications/resolvers/PushNotificationsErrorHelper";

describe("Push Notifications Token Resolver", () => {

    let service: PushNotificationsTokenService;
    let resolver: PushNotificationsTokenResolver;
    let requestContext: RequestContext;
    beforeEach(async () => {
        service = mock(PushNotificationsTokenService);
        resolver = new PushNotificationsTokenResolver(instance(service));
        requestContext = await RequestContextMock.mock();
    });

    context("Set firebase token", () => {

        const TOKEN = "token";

        it("should return token", async () => {

            when(service.setToken(TOKEN, requestContext.user)).thenResolve(Result.Success(TOKEN));

            const result = await resolver.setFirebaseToken(TOKEN, requestContext);
            expect(result).to.eq(TOKEN);
        });

        context("errors", () => {

            it("should raise error when invalid token", async () => {
                when(service.setToken(TOKEN, requestContext.user))
                    .thenResolve(Result.Error(PushNotificationsTokenService.INVALID_TOKEN_ERROR));

                await expect(resolver.setFirebaseToken(TOKEN, requestContext))
                    .to.eventually.be.rejectedWith(PushNotificationsErrorHelper.INVALID_TOKEN_MESSAGE);
            });

        });

    });

    context("Remove firebase token", () => {

        it("should call service with user", async () => {
            await resolver.removeFirebaseToken(requestContext);

            verify(service.removeToken(requestContext.user)).once();
        });

        it("should return user id", async () => {
            const result = await resolver.removeFirebaseToken(requestContext);

            expect(result).to.eq(requestContext.user.getId());
        });

    });

});