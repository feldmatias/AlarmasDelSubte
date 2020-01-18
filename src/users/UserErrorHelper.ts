import {ErrorHelper} from "../utils/ErrorHelper";
import {UserValidator} from "./UserValidator";
import {UserInput} from "./entities/UserInput";
import {UserService} from "./UserService";

class UserErrorHelper extends ErrorHelper {

    public readonly INVALID_PASSWORD_MESSAGE = "La contraseña es inválida";
    public readonly NOT_UNIQUE_USERNAME_MESSAGE = "El nombre de usuario ya existe";
    public readonly INVALID_USERNAME_MESSAGE = "El nombre de usuario es inválido";
    public readonly INVALID_LOGIN_MESSAGE = "El usuario o la contraseña son incorrectos";

    protected errors = new Map([
        [UserInput.INVALID_PASSWORD_ERROR, this.INVALID_PASSWORD_MESSAGE],
        [UserValidator.NOT_UNIQUE_USERNAME_ERROR, this.NOT_UNIQUE_USERNAME_MESSAGE],
        [UserInput.INVALID_USERNAME_ERROR, this.INVALID_USERNAME_MESSAGE],
        [UserService.LOGIN_ERROR, this.INVALID_LOGIN_MESSAGE]
    ]);

}

export default new UserErrorHelper();