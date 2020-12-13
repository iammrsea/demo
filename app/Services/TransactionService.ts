import Transaction from "App/Models/Transaction";

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
}
export default new TransactionService();