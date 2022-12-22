import { Router } from 'express'

import { prisma } from '../prisma'

const renderersRouter = Router()

renderersRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { items } = request.body

  await prisma.renderer.update({
    where: {
      id,
    },
    data: {
      items,
    },
  })

  return response.sendStatus(201)
})

export { renderersRouter }
