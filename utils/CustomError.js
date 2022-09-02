export class CustomError extends Error {
    constructor(message, statucCode) {
        super(message)
        this.statucCode = statucCode
        this.isOperational = true
    
        Error.captureStackTrace(this, this.constructor)
    }
}