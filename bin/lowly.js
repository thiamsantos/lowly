#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const filesize = require('filesize')
const meow = require('meow')
const pify = require('pify')
const lowly = require('../lib/lowly')

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

function getOutputFileName(input) {
  const inputPath = path.parse(input)
  return path.resolve(inputPath.dir, inputPath.name + '-lowly' + inputPath.ext)
}

input.forEach(file => {
  readFile(path.resolve(file))
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
