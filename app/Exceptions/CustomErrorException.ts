import { Exception } from "@poppinss/utils";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";


export default class CustomErrorException extends Exception {
     constructor(message: string,code:number) {
    super(message, code);
  }
  public async handle(error: this, { response }: HttpContextContract) {
    response
      .status(error.status)
      .json({ errors: [{ message: error.message, name: error.name }] });
  }
}
