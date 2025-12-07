const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const ownerId = req.user;
    const fragmentId = req.params.id;

    logger.info(`Route params: ${JSON.stringify(req.params)}`);
    logger.info(`Fragment ID: ${fragmentId}, Owner: ${ownerId}`);

    // Find fragment by owner and ID
    const fragment = await Fragment.byId(ownerId, fragmentId);

    const data = await fragment.getData();

    if (!data) {
      return res.status(404).json({
        status: 'error',
        error: { code: 404, message: 'not found' },
      });
    }

    res.setHeader('Content-Type', fragment.type);
    res.setHeader('Content-Length', fragment.size);
    res.status(200).send(data);
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({
        status: 'error',
        error: { code: 404, message: 'fragment not found' },
      });
    }
    res.status(500).json({ status: 'error', message: err.message });
  }
};
