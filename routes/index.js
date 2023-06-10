const express = require('express')
//const axios = require('axios')
const path = require('path')

const Recipe = require('../models/recipe')
//const config = require('../utils/config')
//const BASE_URL = config.base_url

const router = express.Router()

// eslint-disable-next-line no-unused-vars
router.get('/recipe', async (req, res) => {
  const response = await Recipe.findOne({}).sort({ createdAt: -1 })
  res.status(200).json(response)
})

router.get('/recipe/:food', async (req, res) => {
  let { food } = req.params
  let recipe = await Recipe.findOne({ name: food })
  const partial = req.app.get('partialObj')

  //console.log(recipe)

  if (!recipe) {
    res.status(200).json({ name: food, ...partial })
  }

  const data = {
    name: recipe?.name,
    ingredients: recipe?.ingredients,
    instructions: recipe?.instructions,
  }

  res.render('recipe', {
    title: 'Recipes',
    ...data,
  })
})

router.get('/', async (req, res) => {
  const recipes = await Recipe.find({}).sort({ createdAt: -1 })
  res.render('recipe', { title: 'Recipes', recipes: recipes })
})

router.post('/recipe/', async (req, res) => {
  let { name, instruction, ingredient } = req.body

  try {
    let data = new Recipe({
      name: name,
      ingredients: ingredient,
      instructions: instruction,
    })

    const recipe = await Recipe.create(data)

    res.status(201).json(recipe)
  } catch (err) {
    console.error(err)
  }
})

router.post('/images', async (req, res) => {
  let { recipe } = req.body
  let { images } = req.files
  //console.log(req.files.path);
  let uploadPath
  uploadPath = path.resolve('./uploads') + '/recipe' + images.name
  images.mv(uploadPath)

  if (!images || Object.keys(images).length === 0) {
    return res.status(400).send('No files were uploaded.')
  }

  let data = {
    recipe: recipe,
    images: [images],
  }

  res.send({
    ...data,
    result: 'File image uploaded.',
  })
})

module.exports = router
