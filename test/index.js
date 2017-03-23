const fs = require('fs')
const path = require('path')
const test = require('tape')
const lowly = require('../')

test('lowly', t => {
  const initialSize = fs.readFileSync(
    path.resolve(__dirname, 'fixture.jpeg')
  ).length
  lowly(path.resolve(__dirname, 'fixture.jpeg'))
  const finalSize = fs.readFileSync(
    path.resolve(__dirname, 'fixture-lowly.jpeg')
  ).length

  t.ok(initialSize > finalSize, 'the final size should be much lower')
  t.end()
})
