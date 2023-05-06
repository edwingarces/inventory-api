import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ItemUniqueKeys = 'id' | 'serialNumber';

interface Item {
  id?: string
  name: string
  model: string
  trademark: string
  serialNumber: string
  description: string
  notes: string
  status: number
  loanId: string
  locationId: string
}

interface ItemId {
  id: string
}

interface ItemBodyParams {
  body: Item
  params: ItemId
}

const itemProps = [
  'name',
  'model',
  'trademark',
  'serialNumber',
  'description',
  'notes',
  'status',
  'loanId',
  'locationId'
];

const itemExists = async (id: ItemUniqueKeys, value: string): Promise<Item | null> => {
  const item = await prisma.item.findFirst({
    where: {
      [id]: value,
    },
  });
  return item as unknown as Item;
};

const FindItemById = async (req: any, res: any): Promise<any> => {
  try {
    const { params: { id } }: ItemBodyParams = req;
    const item = await itemExists('id', id);
    if (item !== null) {
      res.status(200).json(item);
    } else {
      return res.status(400).json({
        msg: "Item doesn't exist",
      });
    }
  } catch (error) {
    return res.status(400).json({ msg: "Can't find item" });
  }
};

const GetAllItems = async (req: any, res: any): Promise<any> => {
  try {
    const allItems = await prisma.item.findMany();
    res.status(200).json({ items: allItems });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Can't get items" });
  }
};

const AddItem = async (req: any, res: any): Promise<any> => {
  try {
    const {
      body: {
        name, model, trademark, serialNumber, description, notes, status, loanId, locationId,
      },
    }: ItemBodyParams = req;
    const item = await itemExists('serialNumber', serialNumber);
    if (!name || !model || !trademark || !serialNumber || !description || !notes || status === undefined || !loanId || !locationId) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    if (item !== null) {
      return res.status(400).json({
        msg: 'Name already exists',
      });
    }
    await prisma.item.create({
      data: {
        name, model, trademark, serialNumber, description, notes, status, loanId, locationId,
      },
    });
    res.status(200).json({ msg: 'Item added' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err: "Can't add item" });
  }
};

const UpdateItem = async (req: any, res: any): Promise<any> => {
  try {
    const {
      body,
      params: {
        id,
      },
    }: ItemBodyParams = req;
    let isValidBody = false;
    itemProps.forEach((name) => {
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
      const item = await itemExists('serialNumber', body.serialNumber);
      if (item !== null && item.id !== id) {
        return res.status(400).json({
          msg: 'Email already exists',
        });
      }
    }
    await prisma.item.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    res.status(200).json({ msg: 'Item updated' });
  } catch (error) {
    return res.status(400).json({ msg: "Can't update item" });
  }
};

const DeleteItem = async (req: any, res: any): Promise<any> => {
  try {
    const {
      params: {
        id,
      },
    }: ItemBodyParams = req;
    if (!id) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    await prisma.item.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ msg: 'Item deleted' });
  } catch (error) {
    return res.status(400).json({ msg: "Can't delete item" });
  }
};

export { GetAllItems, AddItem, UpdateItem, DeleteItem, FindItemById };
