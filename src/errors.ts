export class CommandLoadException extends Error {
    
    constructor(message: string) {
        super(message);
        this.name = 'CommandLoadException';
    }

}