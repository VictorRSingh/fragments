const { Fragment } = require('../../model/fragment');
const sharp = require('sharp');
const logger = require('../../logger');

module.exports = async (req, res) => {
  const ownerId = req.user;
  const fragmentId = req.params.id;
  const ext = req.params.ext;

  const fragment = await Fragment.byId(ownerId, fragmentId);

  if (!fragment) {
    return res.status(404).json({
      status: 'error',
      error: { code: 404, message: 'fragment not found' },
    });
  }

  const data = await fragment.getData();

  // Image conversion
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
  }

  // Text conversion
  if (fragment.type.startsWith('text/')) {
    const input = data.toString();

    switch (ext) {
      case 'plain':
        return res.status(200).type('text/plain').send(input);
      case 'html':
        return res.status(200).type('text/html').send(`<html><body><pre>${input}</pre></body></html>`);
      case 'md':
        return res.status(200).type('text/plain').send(input);
      default:
        return res.status(415).json({
          status: 'error',
          error: { code: 415, message: 'unsupported media type for conversion' },
        });
    }
  }
  return res.status(415).json({
    status: 'error',
    error: { code: 415, message: 'unsupported media type for conversion' },
  });
};
