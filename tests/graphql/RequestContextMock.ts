import {RequestContext} from "../../src/graphql/RequestContext";
import {User} from "../../src/users/entities/User";
import {UserFixture} from "../users/UserFixture";

export class RequestContextMock {

    static readonly REQUEST_USER_USERNAME = "request username";

    static async mock(): Promise<RequestContext> {
        const user = await UserFixture.createUserWithUsername(RequestContextMock.REQUEST_USER_USERNAME);

        return new class implements RequestContext {
            user: User = user;

            header(header: string): string {
                return header;
            }
        };
    }
}