/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

var ingredientsArr = []
var instructionsArr = []

const saveForm = document.querySelector('#create-form')

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

saveForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const formData = new FormData()
  const inputName = document.querySelector('#name-text')
  const images = document.querySelector('#image-input')
  const url = 'http://localhost:3000/recipe/'
  const trimIngredient = ingredientsArr.map((element) => {
    return element.trim()
  })
  const trimInstruction = instructionsArr.map((element) => {
    return element.trim()
  })
  let data = {
    name: inputName.value,
    ingredient: trimIngredient,
    instruction: trimInstruction,
  }

  formData.append('recipe', inputName.value)
  for (let i = 0; i < images.files.length; i++) {
    formData.append('images', images.files[i])
  }

  const settings = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    Cache: 'default',
  }

  const imgConfig = {
    method: 'POST',
    body: formData,
  }

  fetch(url, settings)
    .then((res) => {
      res
        .json()
        .then((data) => {
          console.log(data)
          window.location.reload()
          return data
        })
        .catch((e) => console.error(e))
    })
    .catch((e) => console.error(e))

  fetch('http://127.0.0.1:3000/images', imgConfig)
    .then((res) => {
      res
        .json()
        .then((data) => {
          console.log(data)
        })
        .catch((e) => console.error(e))
    })
    .catch((e) => console.error(e))
})
