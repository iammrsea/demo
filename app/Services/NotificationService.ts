import * as admin from "firebase-admin";
import FirebaseConfig from "Config/firebase";
import { Message, MultiCast } from "Contracts/message";

class NotificationService {
    private messaging: admin.messaging.Messaging;

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(FirebaseConfig.credential),
            databaseURL: FirebaseConfig.databaseUrl,
        });
        this.messaging = admin.messaging();
    }
    public getMessaging() {
        return this.messaging;
    }
    public notifyVendorsAndAgents(messages: Message[]) {
        return this.messaging.sendAll(messages);
    }
    public notifyUser(message: Message) {
        return this.messaging.send(message);
    }
    public notifyAllMerchants(message: MultiCast) {
        return this.messaging.sendMulticast(message);
    }
}

export default new NotificationService();
