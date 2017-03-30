#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const filesize = require('filesize')
const meow = require('meow')
const pify = require('pify')
const lowly = require('../lib/lowly')
const mmm = require('mmmagic')

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

const createLowlyImage = fpath => {
  readFile(fpath)
    .then(lowly)
    .then(buff => {
      const outputFile = getOutputFileName(fpath)
      console.log(
        'Finished ' + path.parse(outputFile).base +
        ' with ' + filesize(buff.length)
      )
      return writeFile(outputFile, buff)
    }).catch(err => {
      console.error(err)
    })
}

input.forEach(ip => {
  const isDir = !path.parse(ip).ext

  if (isDir) {
    const basePath = path.resolve(ip)

    fs.readdir(path.resolve(ip), (err, files) => {
      if (err) {
        console.log(err)
      }

      files.forEach(file => {
        const fresolve = path.parse(path.resolve(file))

        readFile(basePath + '/' + file)
          .then(buff => {
            magic.detect(buff, (err, res) => {
              if (err) throw err

              if(res.indexOf('image') !== -1)
                createLowlyImage(basePath + '/' + file)
              else
                console.error('Ignored file : ' + file + ' (not an image)')
            })
          })
      })
    })
  } else {
      readFile(ip)
        .then(buff => {
          magic.detect(buff, (err, res) => {
            if (err) throw err

            if(res.indexOf('image') !== -1)
              createLowlyImage(ip)
            else
              console.error('Ignored file : ' + ip + ' (not an image)')
          })
        })
  }
})
