const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((x,y) => x + y.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((x,y) => {
    if (x === null || y.likes > x.likes) {
      return y
    } else {
      return x
    }
  }, null)

}

const mostBlogs = (blogs) => {
  const checkBlogs = blogs.map(x => x.author)
  const myMap = {}


  checkBlogs.forEach(item => {
    if(myMap[item]) {
      myMap[item]++
    } else {
      myMap[item] = 1
    }
  })


  var curr = null
  for (const x in myMap) {
    if (curr) {
      if (curr.blogs < myMap[x]) {
        curr = {
          author: x,
          blogs: myMap[x]
        }
      }
    } else {
      curr = {
        author: x,
        blogs: myMap[x]
      }
    }
  }

  return curr
}

const mostLikes = (blogs) => {
  const checkBlogs = blogs.map(x => {
    const auth = {
      author: x.author,
      likes: x.likes
    }
    return auth
  })
  const myMap = {}


  checkBlogs.forEach(item => {
    if(myMap[item.author]) {
      myMap[item.author] += item.likes
    } else {
      myMap[item.author] = item.likes
    }
  })


  var curr = null
  for (const x in myMap) {
    if (curr) {
      if (curr.likes < myMap[x]) {
        curr = {
          author: x,
          likes: myMap[x]
        }
      }
    } else {
      curr = {
        author: x,
        likes: myMap[x]
      }
    }
  }

  return curr

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
