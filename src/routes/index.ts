import { Router } from 'express'

import { entitiesRouter } from './entities'
import { fruitsRouter } from './fruits'
import { layoutsRouter } from './layouts'
import { renderersRouter } from './renderers'
import { routesRouter } from './routes'

const routes = Router()

routes.use('/fruits', fruitsRouter)
routes.use('/layouts', layoutsRouter)
routes.use('/routes', routesRouter)
routes.use('/renderers', renderersRouter)
routes.use('/entities', entitiesRouter)

export { routes }
