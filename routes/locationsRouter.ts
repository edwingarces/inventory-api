import { Router } from 'express';
import { Locations } from '../controllers';

const locationsRouter = Router();

locationsRouter.get('/', Locations.GetAllLocations);
locationsRouter.post('/', Locations.AddLocation);
locationsRouter.get('/:id', Locations.FindLocationById);
locationsRouter.put('/:id', Locations.UpdateLocation);
locationsRouter.delete('/:id', Locations.DeleteLocation);

export default locationsRouter;
