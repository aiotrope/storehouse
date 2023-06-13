const express = require('express')
const path = require('path')
//const mongoose = require('mongoose')

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
    const recipes = await Recipe.find({}).sort({ createdAt: -1 })
    res.status(200).json(recipes)
  } catch (error) {
    console.error(error.message)
  }
})

router.get('/recipe/:food', async (req, res) => {
  let { food } = req.params
  try {
    let recipe = await Recipe.findOne({ name: food })
    res.status(200).json(recipe)
  } catch (error) {
    console.error(error.message)
  }
})

router.get('/', async (req, res) => {
  try {
    //console.log(req.cookies)
    //req.session.destroy()
    req.session.recipeName = ''
    res.clearCookie('recipeName')
    console.log(req.session.recipeName)
    const categories = await Category.find({})
    res.render('recipe', { title: 'Storehouse', categories: categories })
  } catch (error) {
    console.error(error.message)
  }
})

router.post('/recipe/', async (req, res) => {
  let { name, instruction, ingredient, dietCategory } = req.body

  if (req.session.recipeName !== name) {
    req.session.recipeName = null
  }

  try {
    let data = new Recipe({
      name: name,
      instructions: instruction,
      ingredients: ingredient,
      categories: dietCategory,
    })

    const newRecipe = await Recipe.create(data)

    //res.cookie('recipeName', newRecipe.name)
    req.session.recipeName = newRecipe.name

    res.status(200).json(newRecipe)
  } catch (err) {
    console.error(err)
  }
})

router.get('/images', async (req, res) => {
  try {
    const images = await Image.find({}).sort({ createdAt: -1 })
    res.status(200).json(images)
  } catch (error) {
    console.error(error.message)
  }
})

router.post('/images', async (req, res) => {
  let { images } = req.files
  //console.log(req.files)
  let uploadPath

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

    const currentRecipe = req.session.recipeName

    const foundRecipe = await Recipe.findOne({ name: currentRecipe })

    if (foundRecipe) {
      foundRecipe.images = foundRecipe.images.concat(newImages)

      await foundRecipe.save()

      res.status(200).json({
        result: 'File image uploaded.',
        ...newImages,
      })
    }

    if (!images || Object.keys(images).length === 0) {
      return res.status(400).send('No files were uploaded.')
    }
  } catch (error) {
    console.error(error.message)
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

/* router.post('/categories', async (req, res) => {
  let { special_diet } = req.body
  try {
    const data = new Category({
      name: special_diet,
    })
    const newCategory = await Category.create(data)

    const currentRecipe = req.session.recipeName

    const foundRecipe = await Recipe.findOne({ name: currentRecipe })

    if (foundRecipe) {
      foundRecipe.categories = foundRecipe.categories.concat(newCategory)

      await foundRecipe.save()

      res.status(200).json({
        ...newCategory,
      })
    }
  } catch (error) {
    console.error(error.message)
  }
}) */

module.exports = router
