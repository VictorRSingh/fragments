const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
    try {
        const ownerId = req.user;
        const { id } = req.params;
        await Fragment.delete(ownerId, id);
        res.status(200).json({ status: 'ok', message: `Fragment ${id} deleted` });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
}