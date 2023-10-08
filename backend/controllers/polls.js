const pollRouter = require('express').Router()
const Poll = require('../models/poll')

// ALL
pollRouter.get('/', async (req, res) => {
  const polls = await Poll
    .find({}).populate('user', { username: 1, name: 1 })

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

  if (!body.title) {
    return res.status(400).json({ error: 'Title is Missing' })
  }

  const user = req.user

  const poll = new Poll({
    title: body.title,
    options: body.options,
    user: user._id,
  })

  const savedPoll = await poll.save()
  user.polls = user.polls.concat(savedPoll._id)
  await user.save()

  res.status(201).json(savedPoll)
})

// DEL
pollRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  const user = req.user
  const poll = await Poll.findById(id)

  if (!poll) {
    return res
      .status(400)
      .json({ error: `Poll by ID ${id} does not exist` })
  }

  if (!poll.user) {
    return res
      .status(404)
      .json({ error: `Poll by ID ${id} does not have owner user` })
  }

  if (poll.user.toString() === user._id.toString()) {
    await Poll.findByIdAndDelete(id)
    user.polls = user.polls.filter(
      pollID => pollID.toString() !== poll._id.toString()
    )
    await user.save()
    res.status(204).end()
  } else {
    return res
      .status(401)
      .json({ error: 'Unauthorized access to the poll' })
  }
})

// UPDATE
pollRouter.put('/:id', async (req, res, next) => {
  const body = request.body

  const poll = {
    title: body.title,
    options: body.options,
  }

  Poll.findByIdAndUpdate(request.params.id, poll, { new: true })
    .then(updatedPoll => {
      response.json(updatedPoll)
    })
    .catch(error => next(error))
})

module.exports = pollRouter