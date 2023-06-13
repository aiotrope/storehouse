const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    encoding: { type: String, required: true, trim: true },
    mimetype: { type: String, required: true, trim: true },
    buffer: Buffer,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    collection: 'Images',
    timestamps: true,
  }
)

ImageSchema.virtual('id', {
  id: this.id,
})

const Image = mongoose.model('Image', ImageSchema)

module.exports = Image
