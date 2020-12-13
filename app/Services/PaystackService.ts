import PaystackConfig from "Config/paystack";
import axios, { AxiosInstance } from "axios";
import InitPayload from "Contracts/paystack/InitPayload";
import InitResponse from "Contracts/paystack/InitResponse";
import CustomErrorException from "App/Exceptions/CustomErrorException";

class PaystackService {
    private readonly client: AxiosInstance;
    private readonly baseUrl = "https://api.paystack.co/";
    constructor() {
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                authorization: `Bearer ${PaystackConfig.privateKey}`,
            },
        });
    }
    public initializeTransaction(payload: InitPayload): Promise<InitResponse | any> {
        return this.client.post("transaction/initialize", { ...payload, amount: payload.amount * 100 })
            .catch(this.handleError);
    }
    public verify(reference: string): Promise<any> {
        return this.client.get("transaction/verify/" + reference)
            .catch(this.handleError);
    }
    private handleError(error) {
        const { response } = error;
        if (response && response.data) {
            throw new CustomErrorException(response.data.message, response.status);
        }
        throw new CustomErrorException(response.statusText, response.status)
    }
    public codes(perPage: number, page: number): Promise<any> {
        return this.client.get("bank", {
            params: {
                perPage,
                page,
            },
        }).catch(this.handleError);
    }
    public refund(transactionRef: string): Promise<any> {
        return this.client.post("refund", {
            transaction: transactionRef
        }).catch(this.handleError);
    }
}

export default new PaystackService();
