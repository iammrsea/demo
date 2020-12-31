import * as admin from "firebase-admin";
import FirebaseConfig from "Config/firebase";
import { Message, MultiCast } from "Contracts/message";
import Driver from "App/Models/Driver";

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
    public async sendNotificationPayload(payload: any) {
        const { driver_id, trip_id, rider_pickup_address, rider_destination_address,
            rider_phone_number, distance_from_rider } = payload;
        const data = {
            driver_id: String(driver_id), trip_id: String(trip_id), pick_up_adddress: rider_pickup_address, destination_address: rider_destination_address,
            rider_phone_number, distance_from_rider,
            title: 'Pickup notification'
        }
        const driver = await Driver.query().where('id', driver_id)
            .preload('token')
            .firstOrFail();
        const token = driver.token.token;
        return this.notifyUser({ data, token });
    }
}

export default new NotificationService();
