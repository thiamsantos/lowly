const fs = require('fs')
const filesize = require('filesize')
const imageSize = require('image-size')
const path = require('path')
const resizeImage = require('resize-img')

function getOutputFileName(input) {
  const inputPath = path.parse(input)
  return path.resolve(inputPath.dir, inputPath.name + '-lowly' + inputPath.ext)
}

function lowly(input) {
  const fileInput = fs.readFileSync(input)
  const fileOutput = getOutputFileName(input)

  const dimensions = imageSize(fileInput)
  const finalWidth = 30
  const finalHeight = Math.round(finalWidth / dimensions.width * dimensions.height)
  resizeImage(fileInput, {width: finalWidth, height: finalHeight})
    .then(buff => {
      fs.writeFileSync(fileOutput, buff)
      console.log('Final size: ' + filesize(buff.length))
    })
}

lowly('fixture.jpeg')
