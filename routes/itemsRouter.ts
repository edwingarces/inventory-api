import { Router } from 'express';
import { Items } from '../controllers';

const itemsRouter = Router();

itemsRouter.get('/', Items.GetAllItems);
itemsRouter.post('/', Items.AddItem);
itemsRouter.get('/:id', Items.FindItemById);
itemsRouter.put('/:id', Items.UpdateItem);
itemsRouter.delete('/:id', Items.DeleteItem);

export default itemsRouter;
