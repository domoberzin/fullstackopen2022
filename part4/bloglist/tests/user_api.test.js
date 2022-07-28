/* eslint-disable linebreak-style */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')


beforeEach (async () => {
  await User.deleteMany({})

  const userObjects = await Promise.all(helper.initialUsers
    .map(async x => {
      const username = x.username
      const name = x.name
      const passwordHash = await bcrypt.hash(x.password, 10)
      const newUser = new User({
        username,
        name,
        passwordHash
      })
      return newUser
    }))
  const promiseArr = userObjects.map(x => x.save())
  await Promise.all(promiseArr)
})

test('user creation successful with unique username', async () => {

  const addUser = {
    username: 'Ryan123',
    name: 'Ryan',
    password: '1234567'
  }

  await api
    .post('/api/users')
    .send(addUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const endRes = await helper.usersInDb()
  expect(endRes).toHaveLength(helper.initialUsers.length + 1)
  expect(endRes.map(x => x.username)).toContain(addUser.username)
})

test('user creation unsuccessful with invalid username', async () => {

  const addUser = {
    username: 'Ry',
    name: 'Ryan',
    password: '1234567'
  }

  const res = await api
    .post('/api/users')
    .send(addUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const endRes = await helper.usersInDb()
  expect(endRes).toHaveLength(helper.initialUsers.length)
  expect(res.body.error).toContain('shorter than the minimum')
})

test('user creation unsuccessful with invalid password', async () => {

  const addUser = {
    username: 'Rya',
    name: 'Ryan',
    password: '12'
  }

  const res = await api
    .post('/api/users')
    .send(addUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const endRes = await helper.usersInDb()
  expect(endRes).toHaveLength(helper.initialUsers.length)
  expect(res.body.error).toContain('shorter than the minimum')
})

afterAll(() => {
  mongoose.connection.close()
})