/* eslint-disable linebreak-style */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
let testId
let headers


beforeEach(async () => {
  await User.deleteMany({})

  const newUser = {
    username: 'test',
    name: 'test',
    password: 'password'
  }

  const res = await api
    .post('/api/users')
    .send(newUser)

  const token = await api
    .post('/api/login')
    .send( {username: 'test', password: 'password'})

  testId = res.body.id
  headers = { 'Authorization': 'bearer ' + token.body.token }
  const finalUser = {
    username: newUser.username,
    name: newUser.name,
    id: testId
  }
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlog
    .map(x => new Blog({ ...x, user: res.body.id }))
  const promiseArr = blogObjects.map(x => x.save())
  await Promise.all(promiseArr)

})

test('blog returned as JSON', async () => {
  await api.get('/api/blog')
    .expect(200)
    .expect('Content-Type', /application\/json/)

})

test('zero blogs', async () => {
  const response = await api.get('/api/blog')

  expect(response.body).toHaveLength(6)
})


test('unique identifier is named id', async () => {
  const response = await Blog.find({})
  response.forEach(x => expect(x._id).toBeDefined)
})

test('valid blog can be added', async () => {
  const newBlog = {
    title: 'Space War',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2021/11/28/Spacewar.html',
    likes: 0,
    user: testId
  }

  await api
    .post('/api/blog')
    .send(newBlog)
    .set(headers)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blog')

  const contents = response.body.map(x => x.title)
  expect(response.body).toHaveLength(helper.initialBlog.length + 1)
  expect(contents).toContain('Space War')
})

test('default likes is 0 if not specified', async () => {
  const newBlog = {
    title: 'Functional Duplications',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2021/10/28/functional-duplication.html',
    user: testId
  }

  await api
    .post('/api/blog')
    .send(newBlog)
    .set(headers)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blog')

  const contents = response.body.filter(x => x.title === 'Functional Duplications')

  expect(contents[0].likes).toBe(0)
})

test('if url and title are missing, respond with 400 bad request', async () => {
  const newBlog = {
    author: 'Robert C. Martin',
    likes: 0,
    user: testId
  }

  await api
    .post('/api/blog')
    .send(newBlog)
    .set(headers)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const response = await helper.blogInDb()


  expect(response).toHaveLength(helper.initialBlog.length)
})


test('deletion of a blog', async () => {
  const newBlog = {
    title: 'More On Types',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2021/06/29/MoreOnTypes.html',
    user: testId
  }

  await api
    .post('/api/blog')
    .send(newBlog)
    .set(headers)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const currBlogs = await helper.blogInDb()
  const deleteThis = currBlogs[currBlogs.length - 1]
  await api
    .delete('/api/blog/' +  deleteThis.id.toString())
    .set(headers)
    .expect(204)

  const remainder = await helper.blogInDb()

  expect(remainder).toHaveLength(helper.initialBlog.length)
  expect(remainder.map(x => x.title)).not.toContain('More On Types')



})


test('updating of a blog', async () => {
  const newBlog = {
    title: 'More On Types',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2021/06/29/MoreOnTypes.html',
    user: testId
  }

  await api
    .post('/api/blog')
    .send(newBlog)
    .set(headers)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const currBlogs = await helper.blogInDb()
  const updateThis = currBlogs[currBlogs.length - 1]

  const updatedBlog = {
    ...newBlog,
    likes: 10
  }

  await api
    .put('/api/blog/' +  updateThis.id.toString())
    .send(updatedBlog)
    .set(headers)
    .expect(200)

  const endResult = await helper.blogInDb()

  expect(endResult).toHaveLength(helper.initialBlog.length + 1)
  const checkBlog = endResult.find(x => x.title === 'More On Types')
  expect(checkBlog.likes).toBe(10)



})

test('adding a blog without token', async () => {
  const newBlog = {
    title: 'More On Types',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2021/06/29/MoreOnTypes.html',
    user: testId
  }

  await api
    .post('/api/blog')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

})

afterAll(() => {
  mongoose.connection.close()
})