/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

var ingredientsArr = []
var instructionsArr = []

const saveForm = document.querySelector('#create-form')

document
  .getElementById('add-ingredient')
  .addEventListener('click', CaptureIngredient)
document
  .getElementById('add-instruction')
  .addEventListener('click', CaptureInstruction)

function CaptureIngredient() {
  let inputIngredient = document.querySelector('#ingredients-text').value
  ingredientsArr.push(inputIngredient)
  let asIngredient = document.getElementById('as-ingredient')
  //console.log([...ingredientsArr].join(" "));
  asIngredient.innerHTML = [...ingredientsArr].join(' ')
  document.getElementById('ingredients-text').value = ''
}

function CaptureInstruction() {
  let inputInstruction = document.querySelector('#instructions-text').value
  instructionsArr.push(inputInstruction)
  let asInstruction = document.getElementById('as-instruction')
  //console.log([...instructionsArr].join(" "));
  asInstruction.innerHTML = [...instructionsArr].join(' ')
  document.getElementById('instructions-text').value = ''
}

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
  const formData = new FormData()

  let data = {
    name: inputName.value,
    ingredient: ingredientsArr,
    instruction: instructionsArr,
  }

  formData.append('recipe', inputName.value)

  for (let i = 0; i < images.files.length; i++) {
    formData.append('images', images.files[i])
  }
  await postRecipe(data)

  await uploadImage(formData)
})
