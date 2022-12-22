import { randomUUID } from 'crypto'
import { Router } from 'express'

import { prisma } from '../prisma'

const routesRouter = Router()

routesRouter.get('/', async (request, response) => {
  const result = await prisma.route.findMany({
    include: {
      layout: true,
      renderer: true,
    },
  })

  return response.json(result)
})

routesRouter.get('/:id', async (request, response) => {
  const { id } = request.params

  const route = await prisma.route.findFirst({
    where: {
      id,
    },
    include: {
      layout: true,
      renderer: true,
    },
  })

  return response.json(route)
})

routesRouter.post('/', async (request, response) => {
  const { label, route, layoutId, rendererId } = request.body

  const routeExists = await prisma.route.findFirst({
    where: {
      route,
    },
  })

  if (routeExists) {
    return response.status(400).json({
      type: 'error',
      message: 'Route exists with same route.',
    })
  }

  if (rendererId) {
    const createdRoute = await prisma.route.create({
      data: {
        id: randomUUID(),
        label,
        route,
        layoutId,
        rendererId,
      },
      include: {
        layout: true,
      },
    })

    return response.json(createdRoute)
  }

  const itemId = randomUUID()

  const createdRoute = await prisma.route.create({
    data: {
      id: randomUUID(),
      label,
      route,
      layout: {
        connect: {
          id: layoutId,
        },
      },
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
    include: {
      layout: true,
    },
  })

  return response.json(createdRoute)
})

routesRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { label, route, loadDataRoute, layoutId } = request.body

  const routeUpdated = await prisma.route.update({
    where: {
      id,
    },
    data: {
      label,
      route,
      loadDataRoute,
      layoutId,
    },
  })

  return response.json(routeUpdated)
})

routesRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  await prisma.route.delete({
    where: {
      id,
    },
  })

  return response.sendStatus(200)
})

// routesRouter.post('/:routeId/renderer', async (request, response) => {
//   const { routeId } = request.params

//   const itemId = randomUUID()

//   const route = await prisma.route.update({
//     where: {
//       id: routeId,
//     },
//     data: {
//       renderer: {
//         create: {
//           id: randomUUID(),
//           default: itemId,
//           items: {
//             [itemId]: {
//               id: itemId,
//               type: 'flex',
//               attributes: {
//                 flex: 1,
//                 direction: 'column',
//               },
//               parentId: null,
//               children: [],
//             },
//           },
//         },
//       },
//     },
//     include: {
//       layout: true,
//       renderer: true,
//     },
//   })

//   return response.json(route)
// })

export { routesRouter }
