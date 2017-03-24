const imageSize = require('image-size')
const resizeImage = require('resize-img')

/**
 * Resize a image preserving the aspect ratio.
 * @param {Buffer} image - the buffer of a image return by fs.readFile.
 * @returns {Promise} that resolves a buffer of the image with low quality.
 */
function lowly(image) {
  const dimensions = imageSize(image)
  const finalWidth = 30
  const finalHeight = Math.round(
    finalWidth / dimensions.width * dimensions.height
  )
  return resizeImage(image, {width: finalWidth, height: finalHeight})
}

module.exports = lowly
