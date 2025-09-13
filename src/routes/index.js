
const express = require("express");

const { author, version } = require("../../package.json");

const router = express.Router();

router.use('/v1', require('./api'));

router.get('/', (req, res) => {
    res.setHeader('Cache-Type', 'no-cache');

    res.status(200).json({
      status: 'ok',
      author,
      version,
      githubUrl: 'https://github.com/VictorRSingh/fragments',
    });
});
module.exports = router;