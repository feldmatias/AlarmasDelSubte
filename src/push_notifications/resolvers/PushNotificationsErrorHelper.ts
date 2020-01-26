import {ErrorHelper} from "../../utils/ErrorHelper";
import {PushNotificationsTokenService} from "../PushNotificationsTokenService";

class PushNotificationsErrorHelper extends ErrorHelper {

    public readonly INVALID_TOKEN_MESSAGE = "El token es inválido";

    protected errors = new Map([
        [PushNotificationsTokenService.INVALID_TOKEN_ERROR, this.INVALID_TOKEN_MESSAGE]
    ]);

}

export default new PushNotificationsErrorHelper();