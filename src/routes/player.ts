import { Router } from 'express';

import { playerController } from '../controllers/player';

export const playerRouter = Router();

playerRouter.get('/players', playerController.index);

playerRouter.post('/players', playerController.create);

playerRouter.get('/players/:id', playerController.get);

playerRouter.put('/players/:id', playerController.update);

playerRouter.delete('/players/:id', playerController.delete);
