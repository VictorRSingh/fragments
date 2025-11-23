const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
  try {
    const ownerId = req.user
    const fragments = await Fragment.byUser(ownerId);
    
    res.status(200).json(
      createSuccessResponse({
        fragments,
      })
    );
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
