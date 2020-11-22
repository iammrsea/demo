import Route from "@ioc:Adonis/Core/Route";
import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default () => {
  Route.get("spec", async ({}: HttpContextContract) => {
    const read = promisify(readFile);
    return await read(join(__dirname, "..", "..", "documentation", "api.yml"));
  });
};
