const { Fragment } = require('../../model/fragment');
const { createSuccessResponse } = require('../../response');

module.exports = async (req, res) => {
    try {
        const ownerId = req.user;
        const id = req.params.id;

        const fragment = await Fragment.byId(ownerId, id);

        return res.status(200).json(
            createSuccessResponse({
                fragment,
            })
        );
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }       
}