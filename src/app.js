const express = require("express")
const cors = require("cors")
const { uuid, isUuid } = require("uuidv4")

const app = express()

app.use(express.json())
app.use(cors())

const repositories = []

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
})

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const id = uuid()
  const repository = { id, title, url, techs, likes: 0 }

  repositories.push(repository)

  return response.status(200).json(repository)
})

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Repository id is not valid.' })
  }
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }
  
  const { title, url, techs } = request.body

  const repositoryUpdated = repositories[repositoryIndex]

  repositoryUpdated.title = title
  repositoryUpdated.url = url
  repositoryUpdated.techs = techs

  repositories[repositoryIndex] = repositoryUpdated

  return response.status(200).json(repositoryUpdated)
})

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Repository id is not valid.' })
  }
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
})

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Repository id is not valid.' })
  }
  
  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  const repositoryUpdated = repositories[repositoryIndex]
  repositoryUpdated.likes = repositoryUpdated.likes + 1


  return response.status(200).json(repositoryUpdated)
})

module.exports = app
