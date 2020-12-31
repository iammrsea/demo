import Env from "@ioc:Adonis/Core/Env";

const FirebaseConfig = {
    credential: JSON.parse(
        Env.get("GOOGLE_APPLICATION_CREDENTIALS") as string,
        (key, value) => {
            if (key === "private_key") {
                return value.replace("$n", "\n");
            }
            return value;
        }
    ),
    databaseUrl: Env.get('FIREBASE_DATABASE_URL')
};
export default FirebaseConfig;
