const optionRouter = require('express').Router()
const Option = require('../models/option')

optionRouter.post('/', async (req, res) => {
    const body = req.body
    if (!body.answer) {
        return res.status(400).json({ error: 'Answer is Missing' })
    }

    const poll = req.poll
    const option = new Option({
        answer: body.answer,
        poll: poll._id,
    })
})