import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type LocationUniqueKeys = 'id' | 'name';

interface Location {
  name: string
  description: string
}

interface LocationId {
  id: string
}

interface LocationBodyParams {
  body: Location
  params: LocationId
}

const locationProps = ['name', 'description'];

const locationExists = async (id: LocationUniqueKeys, value: string): Promise<Location | null> => {
  const location = await prisma.location.findFirst({
    where: {
      [id]: value,
    },
  });
  return location;
};

const FindLocationById = async (req: any, res: any): Promise<any> => {
  try {
    const { params: { id } }: LocationBodyParams = req;
    const location = await locationExists('id', id);
    if (location !== null) {
      res.status(200).json(location);
    } else {
      return res.status(400).json({
        msg: "Location doesn't exist",
      });
    }
  } catch (error) {
    return res.status(400).json({ msg: "Can't find location" });
  }
};

const GetAllLocations = async (req: any, res: any): Promise<any> => {
  try {
    const allLocations = await prisma.location.findMany();
    res.status(200).json({ locations: allLocations });
  } catch (error) {
    return res.status(400).json({ msg: "Can't get locations" });
  }
};

const AddLocation = async (req: any, res: any): Promise<any> => {
  try {
    const {
      body: {
        name,
        description,
      },
    }: LocationBodyParams = req;
    const location = await locationExists('name', name);
    if (!name || !description) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    if (location !== null) {
      return res.status(400).json({
        msg: 'Name already exists',
      });
    }
    await prisma.location.create({
      data: {
        name,
        description,
      },
    });
    res.status(200).json({ msg: 'Location added' });
  } catch (error) {
    return res.status(400).json({ err: "Can't add location" });
  }
};

const UpdateLocation = async (req: any, res: any): Promise<any> => {
  try {
    const {
      body,
      params: {
        id,
      },
    }: LocationBodyParams = req;
    let isValidBody = false;
    locationProps.forEach((name) => {
      if (body.hasOwnProperty(name)) {
        isValidBody = true;
      }
    });
    if (!id && !isValidBody) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    if (body.name) {
      const location = await locationExists('name', body.name);
      if (location !== null) {
        return res.status(400).json({
          msg: 'Email already exists',
        });
      }
    }
    await prisma.location.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    res.status(200).json({ msg: 'Location updated' });
  } catch (error) {
    return res.status(400).json({ msg: "Can't update location" });
  }
};

const DeleteLocation = async (req: any, res: any): Promise<any> => {
  try {
    const {
      params: {
        id,
      },
    }: LocationBodyParams = req;
    if (!id) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    await prisma.location.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ msg: 'Location deleted' });
  } catch (error) {
    return res.status(400).json({ msg: "Can't delete location" });
  }
};

export { GetAllLocations, AddLocation, UpdateLocation, DeleteLocation, FindLocationById };
