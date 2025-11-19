const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const ownerId = req.user;
    const fragmentId = req.params.id;

    // Find fragment by owner and ID
    const fragment = await Fragment.getData(ownerId, fragmentId);
    const fragmentMetaData = await Fragment.byId(ownerId, fragmentId);

    
    if (!fragment) {
      return res.status(404).json({
        status: 'error',
        error: { code: 404, message: 'not found' }
      });
    }
    
    res.setHeader('Content-Type', fragmentMetaData.type);
    res.setHeader('Content-Length', Buffer.byteLength(fragment));
    res.status(200).send(fragment);

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
