import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type UserUniqueKeys = 'id' | 'email';

interface User {
  email: string
  name: string
  lastname: string
  password: string
  level: number
}

interface UserId {
  id: string
}

interface UserBodyParams {
  body: User
  params: UserId
}

const userProps = ['name', 'lastname', 'email', 'level', 'password'];

const userExists = async (id: UserUniqueKeys, value: string): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: {
      [id]: value,
    },
  });
  return user;
};

const FindUserById = async (req: any, res: any): Promise<any> => {
  try {
    const { params: { id } }: UserBodyParams = req;
    const user = await userExists('id', id);
    if (user !== null) {
      res.status(200).json(user);
    } else {
      return res.status(400).json({
        msg: "User doesn't exist",
      });
    }
  } catch (error) {
    return res.status(400).json({ msg: "Can't find user" });
  }
};

const GetAllUsers = async (req: any, res: any): Promise<any> => {
  try {
    const allUsers = await prisma.user.findMany();
    res.status(200).json({ users: allUsers });
  } catch (error) {
    return res.status(400).json({ msg: "Can't get users" });
  }
};

const AddUser = async (req: any, res: any): Promise<any> => {
  try {
    const {
      body: {
        email,
        name,
        lastname,
        password,
        level,
      },
    }: UserBodyParams = req;
    const user = await userExists('email', email);
    if (!email || !name || !lastname || !password || level === undefined) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    if (user !== null) {
      return res.status(400).json({
        msg: 'Email already exists',
      });
    }
    await prisma.user.create({
      data: {
        name,
        email,
        lastname,
        password,
        level,
      },
    });
    res.status(200).json({ msg: 'User added' });
  } catch (error) {
    return res.status(400).json({ err: "Can't add user" });
  }
};

const UpdateUser = async (req: any, res: any): Promise<any> => {
  try {
    const {
      body,
      params: {
        id,
      },
    }: UserBodyParams = req;
    let isValidBody = false;
    userProps.forEach((name) => {
      if (body.hasOwnProperty(name)) {
        isValidBody = true;
      }
    });
    if (!id && !isValidBody) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    if (body.email) {
      const user = await userExists('email', body.email);
      if (user !== null) {
        return res.status(400).json({
          msg: 'Email already exists',
        });
      }
    }
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    res.status(200).json({ msg: 'User updated' });
  } catch (error) {
    return res.status(400).json({ msg: "Can't update user" });
  }
};

const DeleteUser = async (req: any, res: any): Promise<any> => {
  try {
    const {
      params: {
        id,
      },
    }: UserBodyParams = req;
    if (!id) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    await prisma.user.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ msg: 'User deleted' });
  } catch (error) {
    return res.status(400).json({ msg: "Can't delete user" });
  }
};

export { GetAllUsers, AddUser, UpdateUser, DeleteUser, FindUserById };
