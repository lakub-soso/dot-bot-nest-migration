export abstract class AppException extends Error {
    protected constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}
