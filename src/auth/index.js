

if (
    process.env.AWS_COGNITO_POOL_ID &&
    process.env.AWS_COGNITO_CLIENT_ID &&
    process.env.HTPASSWD_FILE
) {
    throw new Error('env configuration for both AWS Cognito and HTTP Basic Auth. Only one is allowed.')    
}

if(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
    module.exports = require('./cognito');
} else if (process.env.HTPASSWD_FILE && process.NODE_ENV !== 'production') {
    module.exports = require('./basic-auth');
} else {
    throw new Error('Missing env vars: no authorization configuration found.');
}