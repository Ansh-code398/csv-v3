import mongoose from 'mongoose'

/* PetSchema will correspond to a collection in your MongoDB database. */
const StorySchema = new mongoose.Schema({
  story: {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    slides: {
      type: Array,
      number: {
        type: Number,
        required: true
      },
      content: {
        type: String,
        required: true
      },
      text_style: {
        type: String,
        required: true
      },
      bgType: {
        type: String,
        default: 'img',
        required: true
      },
      bgLink: {
        type: String,
        required: true
      }
    }
    // userId: {
    //   type: String,
    //   required: true
    // }
  }
}, { timestamps: true })

export default mongoose.models.Story || mongoose.model('Story', StorySchema)
