import {ErrorHelper} from "../../utils/ErrorHelper";
import {UserValidator} from "../validation/UserValidator";
import {UserService} from "../UserService";
import {UserUsernameValidation} from "../validation/UserUsernameValidation";
import {UserPasswordValidation} from "../validation/UserPasswordValidation";

class UserErrorHelper extends ErrorHelper {

    public readonly INVALID_PASSWORD_MESSAGE = "La contraseña es inválida";
    public readonly NOT_UNIQUE_USERNAME_MESSAGE = "El nombre de usuario ya existe";
    public readonly INVALID_USERNAME_MESSAGE = "El nombre de usuario es inválido";
    public readonly INVALID_LOGIN_MESSAGE = "El usuario o la contraseña son incorrectos";

    protected errors = new Map([
        [UserPasswordValidation.ERROR, this.INVALID_PASSWORD_MESSAGE],
        [UserValidator.NOT_UNIQUE_USERNAME_ERROR, this.NOT_UNIQUE_USERNAME_MESSAGE],
        [UserUsernameValidation.ERROR, this.INVALID_USERNAME_MESSAGE],
        [UserService.LOGIN_ERROR, this.INVALID_LOGIN_MESSAGE]
    ]);

}

export default new UserErrorHelper();