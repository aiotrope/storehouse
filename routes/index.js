const express = require('express')
const path = require('path')

const Recipe = require('../models/recipe')
const Image = require('../models/image')
const Category = require('../models/category')

const router = express.Router()

/* const partialObj = {
  ingredients: [
    '12 large guajillo chiles',
    '1/4 cup corn masa harina',
    '1/4 cup unsalted peanuts',
    '1/4 cup raisins',
    '1 whole clove',
  ],
  instructions: [
    'Gather the ingredients.',
    'Make the Mole Base',
    'Mix and Cook the Mole',
  ],
}
 */
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
      .sort({ createdAt: -1 })
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
        name: 1,
        encoding: 1,
        mimetype: 1,
        buffer: 1,
      })
      .populate('categories', { id: 1, name: 1 })

    res.status(200).json(recipe)
  } catch (error) {
    console.error(error.message)
  }
})

router.get('/', async (req, res) => {
  console.log(req.session.recipeName)
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

  /*  if (req.session.recipeName !== name) {
    req.session.recipeName = null
    req.session.destroy()
  }
 */
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

    req.session.recipeName = newRecipe.name
    console.log(req.session.recipeName)

    res.status(200).json(newRecipe)
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message })
  }
})

router.get('/images', async (req, res) => {
  try {
    const images = await Image.find({}).sort({ createdAt: -1 })
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

  if (images.length) {
    Object.values(images).forEach(async (values) => {
      uploadPath = path.resolve('./uploads') + '/recipe-' + values.name
      values.mv(uploadPath)
      let data = {
        name: values.name,
        encoding: values.encoding,
        mimetype: values.mimetype,
        buffer: values.data,
      }
      let docs = await Image.insertMany([data])
      if (docs) {
        const currentRecipe = req.session.recipeName

        await Recipe.updateMany(
          { name: currentRecipe },
          { $push: { images: values.id } }
        )
        return res.send('Files uploaded.')
      }
    })
  } else if (images) {
    uploadPath = path.resolve('./uploads') + '/recipe-' + images.name
    let newImgData = new Image({
      name: images.name,
      encoding: images.encoding,
      mimetype: images.mimetype,
      buffer: images.data,
    })

    const newImage = await Image.create(newImgData)
    const currentRecipe = req.session.recipeName
    const foundRecipe = await Recipe.findOne({ name: currentRecipe })
    if (foundRecipe) {
      foundRecipe.images = foundRecipe.images.concat(newImage)

      await foundRecipe.save()

      return res.status(200).json({
        result: 'File image uploaded.',
        ...newImage,
      })
    }
  }
})

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({})
    res.status(200).json(categories)
  } catch (error) {
    console.error(error.message)
  }
})

module.exports = router

/*
for (let i = 0; i < images.length; i++) {
      uploadPath = path.resolve('./uploads') + '/recipe-' + images[i].name
      images[i].mv(uploadPath)
      let data = {
        name: images[i].name,
        encoding: images[i].encoding,
        mimetype: images[i].mimetype,
        buffer: images[i].data,
      }
      await Image.insertMany([data])
    }

*/
