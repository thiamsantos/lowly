const imageSize = require('image-size')
const resizeImage = require('resize-img')

function lowly(image) {
  const dimensions = imageSize(image)
  const finalWidth = 30
  const finalHeight = Math.round(
    finalWidth / dimensions.width * dimensions.height
  )
  return resizeImage(image, {width: finalWidth, height: finalHeight})
}

module.exports = lowly
