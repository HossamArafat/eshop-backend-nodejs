class ApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith(4)? 'fail in client' : 'error in server'
        this.isOperational = true
    }
}

export default ApiError