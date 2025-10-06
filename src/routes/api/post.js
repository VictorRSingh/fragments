const { createSuccessResponse } = require('../../response');
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  if (!Buffer.isBuffer(req.body)) {
    return res.status(415).json({ error: 'Unsupported Content-Type or empty body' });
  }

  const fragment = new Fragment({
    ownerId: req.user,
    type: req.get('Content-Type'),
  });

  await fragment.setData(req.body);
  await fragment.save();

  const baseUrl = process.env.API_URL || `${req.headers.host}`;
  logger.info(`Base URL: ${baseUrl}`);
  let locationURL;

  locationURL = new URL(`/v1/fragments/${fragment.id}`, baseUrl);

  res.setHeader('Location', locationURL);
  logger.info('Creating fragment', req.body)

    res.status(201).json(
      createSuccessResponse({
        status: 'ok',
        fragment: fragment,
      })
    );
};
