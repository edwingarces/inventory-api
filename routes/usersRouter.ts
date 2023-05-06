import { Router } from 'express';
import { Users } from '../controllers';

const usersRouter = Router();

usersRouter.get('/', Users.GetAllUsers);
usersRouter.post('/', Users.AddUser);
usersRouter.get('/:id', Users.FindUserById);
usersRouter.put('/:id', Users.UpdateUser);
usersRouter.delete('/:id', Users.DeleteUser);

export default usersRouter;
