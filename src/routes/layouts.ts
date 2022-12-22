import { randomUUID } from 'crypto'
import { Router } from 'express'

import { prisma } from '../prisma'

const layoutsRouter = Router()

layoutsRouter.get('/', async (request, response) => {
  const layouts = await prisma.layout.findMany({
    include: {
      routes: {
        include: {
          renderer: true,
        },
      },
      renderer: true,
    },
  })

  return response.json(layouts)
})

layoutsRouter.get('/:id', async (request, response) => {
  const { id } = request.params

  const layout = await prisma.layout.findFirst({
    where: {
      id,
    },
    include: {
      renderer: true,
    },
  })

  return response.json(layout)
})

layoutsRouter.post('/', async (request, response) => {
  const { label } = request.body

  const itemId = randomUUID()

  const layout = await prisma.layout.create({
    data: {
      id: randomUUID(),
      label,
      renderer: {
        create: {
          id: randomUUID(),
          default: itemId,
          items: {
            [itemId]: {
              id: itemId,
              type: 'flex',
              attributes: {
                flex: 1,
                direction: 'column',
              },
              parentId: null,
              children: [],
            },
          },
        },
      },
    },
  })

  return response.json(layout)
})

layoutsRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { label } = request.body

  const layout = await prisma.layout.update({
    where: {
      id,
    },
    data: {
      label,
    },
  })

  return response.json(layout)
})

layoutsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  await prisma.layout.delete({
    where: {
      id,
    },
  })

  return response.sendStatus(200)
})

export { layoutsRouter }
