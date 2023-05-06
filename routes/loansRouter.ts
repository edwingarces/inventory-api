import { Router } from 'express';
import { Loans } from '../controllers';

const loansRouter = Router();

loansRouter.get('/', Loans.GetAllLoans);
loansRouter.post('/', Loans.AddLoan);
loansRouter.get('/:id', Loans.FindLoanById);
loansRouter.put('/:id', Loans.UpdateLoan);
loansRouter.patch('/:id', Loans.FinishLoan);
loansRouter.delete('/:id', Loans.DeleteLoan);

export default loansRouter;
