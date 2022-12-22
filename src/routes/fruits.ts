import { randomUUID } from 'crypto'
import { Router } from 'express'

type Fruit = {
  id: string
  name: string
  weight: number
}

let items: Fruit[] = []

const fruitsRouter = Router()

fruitsRouter.get('/', (request, response) => {
  return response.json(items)
})

fruitsRouter.get('/:id', (request, response) => {
  const { id } = request.params

  const findFruit = items.find((fruit) => fruit.id === id)

  return response.json(findFruit)
})

fruitsRouter.post('/', (request, response) => {
  const { name, weight } = request.body

  const fruit = {
    id: randomUUID(),
    name,
    weight,
  }

  items.push(fruit)

  return response.json(fruit)
})

fruitsRouter.put('/:id', (request, response) => {
  const { id } = request.params
  const { name, weight } = request.body

  const newFruit = {
    id,
    name,
    weight,
  }

  items = items.map((fruit) => (fruit.id === id ? newFruit : fruit))

  return response.json(newFruit)
})

fruitsRouter.delete('/:id', (request, response) => {
  const { id } = request.params

  items = items.filter((fruit) => fruit.id !== id)

  return response.sendStatus(201)
})

export { fruitsRouter }
