const httpStatusCodes = {
    OK_GET: 200, // Successful GET request
    OK_POST: 201, // Successful POST request
    OK_PUT_PATCH: 204, // Successfull PUT or PATCH request
    BAD_REQUEST: 400, // Client should modify the request
    UNAUTHORIZED: 401, // credentials not recognized
    FORBIDDEN: 403, // credentials accepted but don’t have permission
    NOT_FOUND: 404, // the resource does not exist
    GONE: 410, // the resource previously existed but does not now
    TOO_MAMY_REQUESTS: 429, // used for rate limiting and should include retry headers
    INTERNAL_SERVER_ERROR: 500, // Generic server error - may want to retry request
    INTERNAL_SERVER_UNAVAILABLE: 503 // may want to retry request
}

export default httpStatusCodes