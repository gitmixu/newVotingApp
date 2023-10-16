const pollRouter = require('express').Router()
const Poll = require('../models/poll')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

// ALL
pollRouter.get('/', async (req, res) => {
  const polls = await Poll
    .find({}).populate('user', { name: 1, username: 1 })

  res.json(polls)
})

// ID
pollRouter.get('/:id', async (req, res) => {
  const poll = await Poll.findById(req.params.id)
  if (poll) {
    res.json(poll)
  } else {
    res.status(404).end()
  }
})

// NEW
pollRouter.post('/', async (req, res) => {
  const body = req.body

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const poll = new Poll({
    title: body.title,
    options: body.options,
    user: user._id
  })

  const savedPoll = await poll.save()
  user.polls = user.polls.concat(savedPoll._id)
  await user.save()

  res.json(savedPoll)
})

// DEL
pollRouter.delete('/:id', async (req, res) => {
  await Poll.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

// UPDATE
pollRouter.put('/:id', async (req, res, next) => {
  console.log('backend',req, res)
  const body = req.body

  const poll = {
    title: body.title,
    options: body.options,
  }

  Poll.findByIdAndUpdate(req.params.id, poll, { new: true })
    .then(updatedPoll => {
      res.json(updatedPoll)
    })
    .catch(error => next(error))
})

module.exports = pollRouter