import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction';
import PaystackService from 'App/Services/PaystackService';
import TransactionService from 'App/Services/TransactionService';
import TransactionValidator from 'App/Services/validators/TransactionValidator';
import { nanoid } from "nanoid";

export default class TransactionsController {

    public async initialize(ctx: HttpContextContract) {
        const { request, auth } = ctx;
        const { amount } = await TransactionValidator.initialize(request.input('amount', 0));
        const user = auth.user;
        await user!.preload('rider')
        const email = user!.email ? user!.email : nanoid() + '@gmail.com';
        const { data: { data: { access_code, reference } } } = await PaystackService.initializeTransaction({ amount, email, reference: nanoid() });
        const transaction = new Transaction();
        transaction.amountDeposited = amount;
        transaction.amountRemitted = 0;
        transaction.amountWithdrawn = 0;
        transaction.transactionRef = reference;
        await TransactionService.saveTransaction(transaction, user!.role, user!.rider.id);
        return { access_code, reference, amount }
    }
}
