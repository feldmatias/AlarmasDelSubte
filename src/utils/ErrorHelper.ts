export abstract class ErrorHelper {

    public static DEFAULT_ERROR_MESSAGE = "Ocurrió un error";

    protected abstract errors: Map<string, string>;

    public getErrorMessage(error: string): string {
        const message = this.errors.get(error);
        return message ? message : ErrorHelper.DEFAULT_ERROR_MESSAGE;
    }
}