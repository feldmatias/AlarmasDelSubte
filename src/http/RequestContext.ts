import {User} from "../users/entities/User";

export interface RequestContext {
    user?: User;

    header(header: string): string;
}