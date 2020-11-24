import Env from "@ioc:Adonis/Core/Env";

const ImageServiceConfig = {
  imageKit: {
    id: Env.get("IMAGEKIT_ID"),
    publicKey: Env.get("IMAGEKIT_PUBLIC_KEY"),
    privateKey: Env.get("IMAGEKIT_PRIVATE_KEY"),
  },
};
export default ImageServiceConfig;
