import { type Item, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type LoanUniqueKeys = 'id';

interface ItemLessLoan {
  startDate: Date
  endDate: Date
  userId: string
}

interface Loan {
  startDate: Date
  endDate: Date
  userId: string
  itemsIds: string[]
  items: Item[]
}

interface LoanId {
  id: string
}

interface LoanBodyParams {
  body: Loan
  params: LoanId
}

const loanProps = ['startDate', 'endDate', 'userId'];

const loanExists = async (id: LoanUniqueKeys, value: string): Promise<Loan | null> => {
  const loan = await prisma.loan.findFirst({
    where: {
      [id]: value,
    },
  });
  return loan as unknown as Loan;
};

const FindLoanById = async (req: any, res: any): Promise<any> => {
  try {
    const { params: { id } }: LoanBodyParams = req;
    const loan = await loanExists('id', id);
    if (loan !== null) {
      if (loan.itemsIds?.length) {
        const allItems = await prisma.item.findMany({
          where: {
            id: { in: loan.itemsIds },
          },
        });
        loan.items = allItems;
      }
      res.status(200).json(loan);
    } else {
      return res.status(400).json({
        msg: "Loan doesn't exist",
      });
    }
  } catch (error) {
    return res.status(400).json({ msg: "Can't find loan" });
  }
};

const GetAllLoans = async (req: any, res: any): Promise<any> => {
  try {
    const allLoans = await prisma.loan.findMany({
      include: {
        items: true,
      },
    });
    res.status(200).json({ loans: allLoans });
  } catch (error) {
    return res.status(400).json({ msg: "Can't get loans" });
  }
};

const AddLoan = async (req: any, res: any): Promise<any> => {
  try {
    const {
      body: {
        startDate,
        endDate,
        userId,
        itemsIds,
      },
    }: LoanBodyParams = req;
    if (!startDate || !endDate || !userId || !itemsIds) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    const newLoan = await prisma.loan.create({
      data: {
        startDate,
        endDate,
        userId,
        itemsIds,
      },
    });
    await prisma.item.updateMany({
      where: {
        id: { in: itemsIds },
      },
      data: {
        loanId: newLoan.id,
        status: 1,
      },
    });
    res.status(200).json({ msg: 'Loan added' });
  } catch (error) {
    return res.status(400).json({ err: "Can't add loan" });
  }
};

const UpdateLoan = async (req: any, res: any): Promise<any> => {
  try {
    const {
      body,
      params: {
        id,
      },
    }: LoanBodyParams = req;
    let isValidBody = false;
    loanProps.forEach((name) => {
      if (body.hasOwnProperty(name)) {
        isValidBody = true;
      }
    });
    if (!id && !isValidBody) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    await prisma.loan.update({
      where: {
        id,
      },
      data: {
        ...body as ItemLessLoan,
      },
    });
    res.status(200).json({ msg: 'Loan updated' });
  } catch (error) {
    return res.status(400).json({ msg: "Can't update loan" });
  }
};

const DeleteLoan = async (req: any, res: any): Promise<any> => {
  try {
    const {
      params: {
        id,
      },
    }: LoanBodyParams = req;
    if (!id) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    await prisma.item.updateMany({
      where: {
        loanId: id,
      },
      data: {
        loanId: '000000000000000000000000',
        status: 0,
      },
    });
    await prisma.loan.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ msg: 'Loan deleted' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Can't delete loan" });
  }
};

const FinishLoan = async (req: any, res: any): Promise<any> => {
  try {
    const {
      params: {
        id,
      },
    }: LoanBodyParams = req;
    if (!id) {
      return res.status(400).json({
        msg: 'Invalid params',
      });
    }
    await prisma.item.updateMany({
      where: {
        loanId: id,
      },
      data: {
        loanId: '000000000000000000000000',
        status: 0,
      },
    });
    res.status(200).json({ msg: 'Loan finished' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Can't finish loan" });
  }
};

export { GetAllLoans, AddLoan, UpdateLoan, DeleteLoan, FindLoanById, FinishLoan };
