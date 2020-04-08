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
  
  const repository = repositories.find(repo => repo.id === id)
  
  if (!repository) {
    return response.status(400).json({ error: 'Repository not found.' })
  }
  
  const { title, url, techs } = request.body

  repository.title = title
  repository.url = url
  repository.techs = techs

  return response.status(200).json(repository)
})

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Repository id is not valid.' })
  }
  
  const repository = repositories.find(repo => repo.id === id)

  if (!repository) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repositories.pop(repository)

  return response.status(204).send()
})

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Repository id is not valid.' })
  }
  
  const repository = repositories.find(repo => repo.id === id)

  if (!repository) {
    return response.status(400).json({ error: 'Repository not found.' })
  }

  repository.likes += 1

  return response.status(200).json(repository)
})

module.exports = app
