const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('polls', { title: 1, author: 1 })
  res.json(users)
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const { body } = req
    if (!body.password) {
      res.status(400).send({ error: 'User validation failed: password: Path `password` is required.' })
      return
    }
    if (body.password.length < 3) {
      res.status(400).send({ error: `User validation failed: password: Path \`password\` (\`${body.password}\`) is shorter than the minimum allowed length (3).` })
      return
    }
    const saltRounds = 10
    const passwordHash = await (bcrypt.hash(body.password, saltRounds))
    const user = new User({
      name: body.name,
      username: body.username,
      passwordHash,
    })
    const savedUser = await user.save()
    res.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

// DEL
usersRouter.delete('/:id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = usersRouter