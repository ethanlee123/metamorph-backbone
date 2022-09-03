export class BaseError extends Error {
    constructor(message, statucCode, isOperational=true) {
        super(message)
        this.statucCode = statucCode
        this.isOperational = isOperational
    
        Error.captureStackTrace(this, this.constructor)
    }
}