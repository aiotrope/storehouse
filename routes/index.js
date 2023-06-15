const express = require('express')
const path = require('path')
const mime = require('mime-types')
const fs = require('fs')

const Recipe = require('../models/recipe')
const Image = require('../models/image')
const Category = require('../models/category')

const router = express.Router()

router.get('/recipe/', async (req, res) => {
  try {
    const recipes = await Recipe.find({})
      .populate('images', {
        id: 1,
        name: 1,
        encoding: 1,
        mimetype: 1,
        buffer: 1,
      })
      .populate('categories', { id: 1, name: 1 })
    res.status(200).json(recipes)
  } catch (err) {
    console.error(err.message)
    res.status(400).json({ error: err.message })
  }
})

router.get('/recipe/:food', async (req, res) => {
  let { food } = req.params

  try {
    let recipe = await Recipe.findOne({ name: food })
      .populate('images', {
        id: 1,
      })
      .populate('categories', { id: 1 })
    res.status(200).json(recipe)
  } catch (error) {
    console.error(error.message)
  }
})

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({})
    res.render('recipe', { title: 'Storehouse', categories: categories })
  } catch (err) {
    console.error(err.message)
    res.status(400).json({ error: err.message })
  }
})

router.post('/recipe/', async (req, res) => {
  let { name, instruction, ingredient, dietCategory } = req.body

  try {
    let data = new Recipe({
      name: name,
      instructions: instruction,
      ingredients: ingredient,
    })

    const newRecipe = await Recipe.create(data)

    for (let category of dietCategory) {
      const categories = await Category.findOne({ name: category })

      newRecipe.categories = newRecipe.categories.concat(categories)

      await newRecipe.save()
    }

    res.cookie('recipeName', newRecipe.name)

    //console.log(req.cookies.recipeName)

    res.status(200).json(newRecipe)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

router.get('/images', async (req, res) => {
  try {
    const images = await Image.find({})
    res.status(200).json(images)
  } catch (err) {
    console.error(err.message)
    res.status(400).json({ error: err.message })
  }
})

router.post('/images', async (req, res) => {
  let { images } = req.files
  //console.log(req.files)
  let uploadPath

  if (!images || Object.keys(images).length === 0) {
    return res.status(400).send('No files were uploaded.')
  }

  try {
    uploadPath = path.resolve('./uploads') + '/recipe-' + images.name

    images.mv(uploadPath)

    const data = new Image({
      name: images.name,
      encoding: images.encoding,
      mimetype: images.mimetype,
      buffer: images.data,
    })

    const newImages = await Image.create(data)

    const currentRecipe = req.cookies.recipeName

    const foundRecipe = await Recipe.findOne({ name: currentRecipe })

    if (foundRecipe) {
      foundRecipe.images = foundRecipe.images.concat(newImages)

      await foundRecipe.save()

      return res.status(200).json({
        result: 'Image file uploaded.',
        ...newImages,
      })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: err.message })
  }
})

router.get('/images/:imageId', async (req, res) => {
  let { imageId } = req.params

  try {
    let image = await Image.findById(imageId)

    res.cookie('imageName', image.name)

    let imgDiv = `<div id="images"><img src='http://localhost:3000/recipe-${image.name}' /><br><br><a href="/download">Download</a></div>`

    res.send(imgDiv)
  } catch (err) {
    console.error(err.message)
    res.status(400).json({ error: err.message })
  }
})

router.get('/download', (req, res) => {
  const downloadPath =
    path.resolve('./uploads') + '/recipe-' + req.cookies.imageName
  //res.download(downloadPath)

  const filename = path.basename(downloadPath)

  const mimetype = mime.contentType(downloadPath)

  res.setHeader('Content-disposition', 'attachment; filename=' + filename)

  res.setHeader('Content-type', mimetype)

  const filestream = fs.createReadStream(downloadPath)
  filestream.pipe(res)
})

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({})

    res.status(200).json(categories)
  } catch (err) {
    console.error(err.message)
    res.status(400).json({ error: err.message })
  }
})

module.exports = router
