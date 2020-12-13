import Env from "@ioc:Adonis/Core/Env";

export default {
    publicKey: Env.get("PAYSTACK_PUBLIC_KEY") as string,
    privateKey: Env.get("PAYSTACK_SECRET_KEY") as string,
};
