/* eslint-disable no-undef */
'use strict'

var ingredientsArr = []
var instructionsArr = []
//var dietArr = []
var renderRecipes = document.querySelector('#render-recipes')
var asIngredient = document.getElementById('as-ingredient')
var asInstruction = document.getElementById('as-instruction')
var search = document.querySelector('#search')

const saveForm = document.querySelector('#create-form')

const captureIngredient = () => {
  let inputIngredient = document.querySelector('#ingredients-text').value
  ingredientsArr.push(inputIngredient)
  let asIngredient = document.getElementById('as-ingredient')
  asIngredient.innerHTML = [...ingredientsArr].join(' ')
  document.getElementById('ingredients-text').value = ''
}

const captureInstruction = () => {
  let inputInstruction = document.querySelector('#instructions-text').value
  instructionsArr.push(inputInstruction)
  let asInstruction = document.getElementById('as-instruction')
  asInstruction.innerHTML = [...instructionsArr].join(' ')
  document.getElementById('instructions-text').value = ''
}

/* const captureSpecialDiet = () => {
  let inputDiet = document.querySelector('#text').value
  dietArr.push(inputDiet)
} */

document
  .getElementById('add-ingredient')
  .addEventListener('click', captureIngredient)
document
  .getElementById('add-instruction')
  .addEventListener('click', captureInstruction)

const clearForm = () => {
  saveForm.reset()
  ingredientsArr.length = 0
  instructionsArr.length = 0
  specialDietArrArr.length = 0
  asIngredient.innerHTML = ''
  asInstruction.innerHTML = ''
}

const fetchAndSetAllRecipes = async () => {
  try {
    const response = await fetch('http://localhost:3000/recipe/')
    const data = await response.json()
    if (response.status === 200 && data) {
      // clone array
      let clone = await JSON.parse(JSON.stringify(data))
      renderList(clone)
    }
  } catch (error) {
    console.error('Error fetching recipes: ', error.message)
  }
}

fetchAndSetAllRecipes()

const fetchAndSetAllCategories = async () => {
  try {
    const response = await fetch('http://localhost:3000/categories')
    const data = await response.json()
    if (response.status === 200 && data) {
      //let clone = await JSON.parse(JSON.stringify(data))
      //renderList(clone)
    }
  } catch (error) {
    console.error('Error fetching recipes: ', error.message)
  }
}

fetchAndSetAllCategories()

const postRecipe = async (data) => {
  try {
    const response = await fetch('http://localhost:3000/recipe/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    console.log('Success:', result)
    return result
  } catch (error) {
    console.error('Error:', error)
  }
}

const uploadImage = async (formData) => {
  try {
    const response = await fetch('http://localhost:3000/images', {
      method: 'POST',
      body: formData,
    })
    const result = await response.json()
    console.log('Success:', result)
  } catch (error) {
    console.error('Error:', error)
  }
}

saveForm.addEventListener('submit', async (event) => {
  event.preventDefault()
  const inputName = document.querySelector('#name-text')
  const images = document.querySelector('#image-input')
  const dietInput = document.querySelector('#special-diet')
  const formData = new FormData()

  let data = {
    name: inputName.value,
    ingredient: ingredientsArr,
    instruction: instructionsArr,
  }

  let category = {
    dietCategory: dietInput.value,
  }

  formData.append('recipe', inputName.value)

  for (let i = 0; i < images.files.length; i++) {
    formData.append('images', images.files[i])
  }
  await postRecipe(data)
  await uploadImage(formData)
  await addCategory(category)
  clearForm()
})

search.addEventListener('change', async (event) => {
  let userInput = event.target.value
  try {
    const response = await fetch(`http://localhost:3000/recipe/${userInput}`)
    const data = await response.json()
    if (response.status === 200 && data) {
      renderSearch(data)
    }
  } catch (error) {
    console.error('Search error: ', error.message)
  }
})

const renderList = (arrObj) => {
  let div = ``
  Object.values(arrObj).forEach(({ id, name, instructions, ingredients }) => {
    div += `<div id='list-of-recipes' key=${id}>
    <h3><a href="http://localhost:3000/recipe/${name}">${name}</a></h3>
    <h4>Ingredients</h4><ul>${ingredients
    .map(function (el) {
      return '<li>' + el + '</li>'
    })
    .join('')}</ul>
    <h5>Instructions</h5><ol style='padding-left:2rem;'>${instructions
    .map((el) => {
      return '<li>' + el + '</li>'
    })
    .join('')}</ol>
    </div>`
  })

  renderRecipes.innerHTML = div
}

const renderSearch = (data) => {
  let div = ``
  div += `<div id='search-result'>
    <h3><a href="http://localhost:3000/recipe/${data.name}">${
  data.name
}</a></h3>
    <h4>Ingredients</h4><ul>${data.ingredients
    .map(function (el) {
      return '<li>' + el + '</li>'
    })
    .join('')}</ul>
    <h5>Instructions</h5><ol style='padding-left:2rem;'>${data.instructions
    .map((el) => {
      return '<li>' + el + '</li>'
    })
    .join('')}</ol>
    </div>`

  renderRecipes.innerHTML = div
}