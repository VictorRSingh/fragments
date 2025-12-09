const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');
const logger = require('../../logger');

module.exports = async (req, res) => {
  try {
    const ownerId = req.user;
    const { id } = req.params;

    const existingFragment = await Fragment.byId(ownerId, id);
    if (!existingFragment) {
      return res.status(404).json({ status: 'error', message: 'Fragment not found' });
    }

    let body = req.body;

    if (!Buffer.isBuffer(body)) {
      if (typeof body === 'string') {
        body = Buffer.from(body, 'utf-8');
      } else {
        logger.error('Request body is not a buffer or string');
        return res.status(415).json({ error: 'Unsupported Content-Type or empty body' });
      }
    }
    const contentType = req.get('Content-Type') || existingFragment.type;
    existingFragment.type = contentType;
    existingFragment.size = body.length;

    await existingFragment.setData(body);
    await existingFragment.save();

    logger.info(`Fragment ${id} updated by user ${ownerId}`);

    res.status(200).json(
      createSuccessResponse({
        fragment: existingFragment,
      })
    );
  } catch (err) {
    logger.error(err, 'Failed to update fragment');
    res.status(500).json({ status: 'error', message: err.message });
  }
};
