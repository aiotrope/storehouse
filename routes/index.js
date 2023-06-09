const express = require('express')
const axios = require('axios')
const path = require('path')

const router = express.Router()

router.get('/recipe', (req, res) => {
  let Recipes = req.app.get('Recipes')
  res.json({ ...Recipes })
})

router.get('/recipe/:food', (req, res) => {
  let Recipes = req.app.get('Recipes')
  let { food } = req.params
  const partial = req.app.get('partialObj')
  let recipeObj = Recipes.find((element) => element.name === food)
  if (!recipeObj) {
    recipeObj = {
      name: food,
      ...partial,
    }
  }

  if (req.header('Accept').includes('application/json')) {
    res.json(recipeObj)
  } else {
    res.render('recipe', {
      title: 'Recipes',
      ...recipeObj,
    })
  }
})

router.get('/', (req, res) => {
  let Recipes = req.app.get('Recipes')
  let recipe = Recipes[0]

  axios(`http://localhost:3000/recipe/${recipe.name}`)
    .then((response) => {
      //console.log(response.data);
      res.render('recipe', { title: 'Recipes', ...response.data })
    })
    .catch((e) => console.error(e))
})

router.post('/recipe/', (req, res) => {
  let Recipes = req.app.get('Recipes')
  let { name, instruction, ingredient } = req.body

  //console.log(images);
  let data = {
    name: name,
    ingredients: ingredient,
    instructions: instruction,
  }

  Recipes.unshift(data)

  let newRecipe = Recipes.find((element) => element.name === name)

  if (newRecipe) {
    res.send({
      ...newRecipe,
    })
  }
})

router.post('/images', (req, res) => {
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