const Poll = require('../models/poll')
const User = require('../models/user')

const initialPolls = [
  {
    'title': 'backend tests are fun',
    'options': [
        {
            answer: 'yes'
        },
        {
            answer: 'no'
        }
    ]
  },
  {
    'title': 'coding night every night',
    'options': [
        {
            answer: 'yes'
        },
        {
            answer: 'no'
        }
    ]
  }
]

const pollsInDb = async () => {
  const polls = await Poll.find({})
  return polls.map(p => p.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initialPolls,
  pollsInDb,
  usersInDb
}