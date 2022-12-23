import { Router } from 'express'
import { randomUUID } from 'node:crypto'

import { prisma } from '../prisma'

const entitiesRouter = Router()

entitiesRouter.get('/', async (request, response) => {
  const entities = await prisma.entity.findMany()

  return response.json(entities)
})

entitiesRouter.get('/:id', async (request, response) => {
  const { id } = request.params

  const entity = await prisma.entity.findFirst({
    where: {
      id,
    },
  })

  return response.json(entity)
})

entitiesRouter.post('/', async (request, response) => {
  const { name, fields } = request.body

  const entity = await prisma.entity.create({
    data: {
      id: randomUUID(),
      name,
      fields,
    },
  })

  return response.json(entity)
})

entitiesRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { name, fields } = request.body

  const entity = await prisma.entity.update({
    where: {
      id,
    },
    data: {
      name,
      fields,
    },
  })

  return response.json(entity)
})

entitiesRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  await prisma.entity.delete({
    where: {
      id,
    },
  })

  return response.sendStatus(200)
})

export { entitiesRouter }
