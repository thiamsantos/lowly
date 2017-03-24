import fs from 'fs'
import path from 'path'
import test from 'ava'
import pify from 'pify'
import lowly from '../'

const readFile = pify(fs.readFile)

test('lowly', async t => {
  const image = await readFile(path.resolve(__dirname, 'fixture.jpeg'))
  const lowlyImage = await lowly(image)

  const initialSize = image.length
  const finalSize = lowlyImage.length

  t.true(initialSize > finalSize, 'the final size should be much lower')
})
