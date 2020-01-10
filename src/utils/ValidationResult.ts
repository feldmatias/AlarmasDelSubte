export class ValidationResult {

    public static Success(): ValidationResult {
        return new ValidationResult();
    }

    public static Error(error: string): ValidationResult {
        return new ValidationResult(error);
    }

    private readonly error?: string;

    private constructor(error?: string) {
        this.error = error;
    }

    public isSuccessful(): boolean {
        return this.error == undefined;
    }

    public getError(): string {
        return this.error as string;
    }
}