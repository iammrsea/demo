import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction';
import Wallet from 'App/Models/Wallet';
import PaystackService from 'App/Services/PaystackService';
import TransactionService from 'App/Services/TransactionService';
import TransactionValidator from 'App/Services/validators/TransactionValidator';
import { nanoid } from "nanoid";

export default class TransactionsController {

    public async initialize(ctx: HttpContextContract) {
        const { request, auth } = ctx;
        const { amount } = await TransactionValidator.initialize(request.input('amount', 0));
        const user = auth.user;
        await user!.preload('rider', rider => rider.preload('wallet'));

        //Initialize wallet for a user if they don't have one
        if (!user!.rider.wallet) {
            const wallet = new Wallet();
            wallet.balance = 0;
            wallet.cummulativeAmount = 0;
            await user!.rider.related('wallet').save(wallet);
        }
        const email = user!.email ? user!.email : nanoid() + '@gmail.com';
        const { data: { data: { access_code, reference } } } = await PaystackService.initializeTransaction({ amount, email, reference: nanoid() });
        const transaction = new Transaction();
        transaction.amountDeposited = 0;
        transaction.amountRemitted = 0;
        transaction.amountWithdrawn = 0;
        transaction.transactionRef = reference;
        await TransactionService.saveTransaction(transaction, user!.role, user!.rider.id);
        return { access_code, reference, amount }
    }
    public async verify({ params, auth }: HttpContextContract) {
        const user = auth.user;
        const { data } = await PaystackService.verify(params.reference);
        await user!.preload('rider', rider => rider.preload('wallet'));

        if (data.data.status !== 'success') {
            return {
                status: true,
                message: 'Verification successful',
                data: {
                    reference: params.reference,
                    is_transaction_successful: false,
                    previous_balance: user!.rider.wallet.balance,
                    current_balance: user!.rider.wallet.balance,
                }
            }
        }
        const amount = (data.data.amount / 100)
        //Update transaction
        await TransactionService.updateTransaction({
            amountDeposited: amount, amountRemitted: 0, amountWithdrawn: 0,
            transactionRef: params.reference
        });

        //Add money to wallet;
        await user!.rider.wallet.addMoney(amount);

        return {
            status: true,
            message: 'Verification successful',
            data: {
                reference: params.reference,
                is_transaction_successful: false,
                previous_balance: user!.rider.wallet.balance,
                current_balance: user!.rider.wallet.balance + amount,
            }
        }
    }
}
