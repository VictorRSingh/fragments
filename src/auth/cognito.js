// const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');
const authorize = require("./auth-middleware")

const logger = require('../logger');

if(!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID)) {
  throw new Error('Missing expect env vars: AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID');
}

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  tokenUse: 'id',
});

logger.info('Configuring to use AWS Cognito for Authorization');

jwtVerifier
  .hydrate()
  .then(() => {
    logger.info('Cognito JWKS successfully cached');
  })
  .catch((err) => {
    logger.error({ err }, 'Unable to cache Cognito JWKS');
  });


  module.exports.strategy = () => 
    new BearerStrategy(async (token, done) => {
        try {
            const user = await jwtVerifier.verify(token);
            logger.debug({ user }, 'Verified user from token');
            done(null, user.email);
        } catch (err) {
            logger.error({ err }, 'Failed to verify user from token');
            done(null, false);
        }
    });



    // module.exports.authenticate = () => passport.authenticate('bearer', { session: false });
    module.exports.authenticate = () => authorize('bearer');