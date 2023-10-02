const pollRouter = require('express').Router();
const Poll = require('../models/poll');

pollRouter.get('/', (req, res) => {
    Poll.find({}).then(polls => {
        res.json(polls);
    })
})

pollRouter.get('/:id', (req, res, next) => {
    Poll.findById(req.params.id)
        .then(poll => {
            if (poll) { res.json(poll); }
            else { res.status(404).end(); }
        })
        .catch(error => next(error));
});

pollRouter.post('/', (req, res, next) => {
    const body = req.body;
    const poll = new Poll({
        title: body.title,
        options: body.options
    });

    poll.save()
        .then(savedPoll => { res.json(savedPoll) })
        .catch(error => next(error));
});

module.exports = pollRouter