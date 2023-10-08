const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')
const Poll = require('../models/poll')
const User = require('../models/user')

/* POLLS IN DB */
describe('poll', () => {
  // initialization
  let token
  beforeEach(async () => {
    await Poll.deleteMany({})
    await User.deleteMany({})
    const user = 
      await api.post('/api/users').send({ name: 'testUser', username: 'testUser', password: 'testPassword' })
    const pollObjects = helper.initialPolls
      .map((poll) => {
        const newPoll = new Poll(poll)
        newPoll.user = user.body.id
        return newPoll
      })
    const promiseArray = pollObjects.map((poll) => poll.save())
    const savedPolls = await Promise.all(promiseArray)
    user.body.polls = savedPolls.map((x) => x.id)
    await User.findByIdAndUpdate(user.body.id, user.body)
    const loginResponse = await api.post('/api/login').send({ username: 'testUser', password: 'testPassword' })
    token = 'bearer '.concat(loginResponse.body.token)
  })

  describe('update and delete operations', () => {
    test('poll deletion works', async () => {
      const pollsBefore = await api.get('/api/polls')
      const pollId = pollsBefore.body[0].id
      const response = await api.delete(`/api/polls/${pollId}`).set('Authorization', token)
      const pollsAfter = await api.get('/api/polls')
      expect(pollsBefore.body.length).toBe(pollsAfter.body.length + 1)
      expect(response.statusCode).toBe(204)
    })
  })

  describe('post operations', () => {
    test('if title properties are missing from req data backend res status code 400 Bad Request', async () => {
      let poll = { ...helper.initialPolls[0] }
      delete poll.title
      let response = await api.post('/api/polls').send(poll).set('Authorization', token)
      expect(response.statusCode).toBe(400)
      expect(response.res.statusMessage).toBe('Bad Request')
    })
    test('if options properties are missing from req data backend res status code 400 Bad Request', async () => {
      let poll = { ...helper.initialPolls[0] }
      delete poll.title
      let response = await api.post('/api/polls').send(poll).set('Authorization', token)
      expect(response.statusCode).toBe(400)
      expect(response.res.statusMessage).toBe('Bad Request')
    })
    test('if title and options properties are missing from req data backend res status code 400 Bad Request', async () => {
      let poll = { ...helper.initialPolls[0] }
      delete poll.title
      delete poll.options
      let response = await api.post('/api/polls').send(poll).set('Authorization', token)
      expect(response.statusCode).toBe(400)
      expect(response.res.statusMessage).toBe('Bad Request')
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})