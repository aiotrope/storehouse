const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: [{ type: String, trim: true }],
    instructions: [{ type: String, trim: true }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'Recipes',
    timestamps: true,
  }
)

RecipeSchema.virtual('id', {
  id: this.id,
})

const Recipe = mongoose.model('Recipe', RecipeSchema)

module.exports = Recipe
