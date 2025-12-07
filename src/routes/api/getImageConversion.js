const { Fragment } = require('../../model/fragment');
const sharp = require('sharp');

const logger = require('../../logger');

module.exports = async (req, res) => {
  const ownerId = req.user;
  const fragmentId = req.params.id;
  const ext = req.params.ext;

  logger.info(`Route params: ${JSON.stringify(req.params)}`);
  logger.info(`Fragment ID: ${fragmentId}, Requested extension: ${ext}, Owner: ${ownerId}`);

  const fragment = await Fragment.byId(ownerId, fragmentId);

  const data = await fragment.getData();

  if (fragment.type.startsWith('image/')) {
    try {
      const outputBuffer = await sharp(data).toFormat(ext).toBuffer();
      res.set('Content-Type', `image/${ext}`);
      res.set('Content-Length', outputBuffer.length);
      return res.status(200).send(outputBuffer);
    } catch (err) {
      logger.error(`Unsupported image conversion: ${err.message}`);
      return res.status(415).json({
        status: 'error',
        error: { code: 415, message: 'unsupported media type for conversion' },
      });
    }
  } else if (fragment.type.startsWith('text/')) {
    const input = data.toString();

    if (fragment.type === 'text/plain') {
      if (ext === 'plain') {
        return res.status(200).type('text/plain').send(input);
      }
      if (ext === 'html') {
        const htmlOutput = `<html><body><pre>${input}</pre></body></html>`;
        return res.status(200).type('text/html').send(htmlOutput);
      }
      if (ext === 'md') {
        return res.status(200).type('text/plain').send(input);
      } else {
        return res.status(415).json({
          status: 'error',
          error: { code: 415, message: 'unsupported media type for conversion' },
        });
      }
    }
  } else {
    return res.status(404).json({
      status: 'error',
      error: { code: 404, message: 'fragment not found' },
    });
  }
};
