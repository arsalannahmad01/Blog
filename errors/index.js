const BadRequestError = require('./bad-request')
const NotFoundError = require('./not-found')
const UnauthenticatedError = require('./unauthenticated')
const CustomAPIError = require('./custom-api')
const Forbidden = require('./forbidden')

module.exports = {
    BadRequestError,
    NotFoundError,
    UnauthenticatedError,
    CustomAPIError,
    Forbidden
}