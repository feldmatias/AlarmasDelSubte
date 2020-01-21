import {RequestContext} from "../../src/graphql/RequestContext";
import {User} from "../../src/users/entities/User";
import {UserFixture} from "../users/UserFixture";

export class RequestContextMock {

    public static readonly REQUEST_USER_USERNAME = "request username";

    public static async mock(): Promise<RequestContext> {
        const user = await UserFixture.createUserWithUsername(RequestContextMock.REQUEST_USER_USERNAME);

        return new class implements RequestContext {
            public user: User = user;

            public header(header: string): string {
                return header;
            }
        };
    }
}