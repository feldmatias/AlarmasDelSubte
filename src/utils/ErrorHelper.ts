export abstract class ErrorHelper {

    public static readonly DEFAULT_ERROR_MESSAGE = "Ocurrió un error";
    public static readonly AUTHORIZATION_ERROR_MESSAGE = "Es necesario estar logueado para realizar la operación";

    protected abstract errors: Map<string, string>;

    public getErrorMessage(error: string): string {
        const message = this.errors.get(error);
        return message ? message : ErrorHelper.DEFAULT_ERROR_MESSAGE;
    }
}