#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const filesize = require('filesize')
const meow = require('meow')
const pify = require('pify')
const mmm = require('mmmagic')
const lowly = require('../lib/lowly')

const Magic = mmm.Magic
const magic = new Magic(mmm.MAGIC_MIME_TYPE)

const readFile = pify(fs.readFile)
const writeFile = pify(fs.writeFile)

const cli = meow(`
  Usage
    $ lowly <input>

  Examples
    $ lowly image.jpg
    $ lowly images/**/* image.jpg

`, {
  alias: {
    o: 'output'
  }
})

const input = cli.input

const getOutputFileName = input => {
  const inputPath = path.parse(input)
  return path.resolve(inputPath.dir, inputPath.name + '-lowly' + inputPath.ext)
}

const checkType = (buff, file) => {
  return new Promise((resolve, reject) => {
    magic.detect(buff, (err, res) => {
      if (res.indexOf('image') >= 0) {
        resolve(buff)
      } else {
        reject(err || 'Ignored file : ' + file + ' (not an image)')
      }
    })
  })
}

input.forEach(file => {
  readFile(path.resolve(file))
    .then(buff => checkType(buff, file))
    .then(lowly)
    .then(buff => {
      const outputFile = getOutputFileName(file)
      console.log(
        'Finished ' + path.parse(outputFile).base +
        ' with ' + filesize(buff.length)
      )
      return writeFile(outputFile, buff)
    }).catch(err => {
      console.error(err)
    })
})
