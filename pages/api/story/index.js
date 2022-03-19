import dbConnect from '../../../lib/dbConnect'
import Story from '../../../models/Story';
import NextCors from 'nextjs-cors';

export default async function handler(req, res) {
  const { method } = req
  await dbConnect()

  await NextCors(req, res, {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200
  })

  switch (method) {
    case 'GET':
      try {
        const pets = await Story.find() /* find all the data in our database */
        res.status(200).json({ success: true, data: pets })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'POST':
      try {
        const pet = await Story.create(
          req.body
        ) /* create a new model in the database */
        res.status(201).json({ success: true, data: pet })
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
