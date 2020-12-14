import Transaction from "App/Models/Transaction";
import UpdateTransactionDto from "Contracts/UpdateTransactionDto";

class TransactionService {
    public saveTransaction(transaction: Transaction, role: string, id: number) {
        switch (role) {
            case 'driver':
                transaction.driverId = id;
                return transaction.save();
            case 'rider':
                transaction.riderId = id;
                return transaction.save();
            default:
                return transaction.save();
        }
    }
    public async updateTransaction(updateDto: UpdateTransactionDto) {
        const { transactionRef, amountDeposited, amountRemitted, amountWithdrawn } = updateDto;
        const transaction = await Transaction.query().where('transaction_ref', transactionRef)
            .firstOrFail();
        transaction.amountDeposited = +transaction.amountDeposited + amountDeposited
        transaction.amountRemitted = +transaction.amountRemitted + amountRemitted;
        transaction.amountWithdrawn = +transaction.amountWithdrawn + amountWithdrawn;
        return transaction.save();

    }
}
export default new TransactionService();