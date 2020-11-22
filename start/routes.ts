import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Route from "@ioc:Adonis/Core/Route";
import HealthCheck from "@ioc:Adonis/Core/HealthCheck";

import {
  authRoutes,
  userRoutes,
  tokenRoutes,
  docRoutes,
  factoryRoutes,
  imageRoutes,
} from "./Routes/index";

//Health route
Route.get("health", async ({ response }: HttpContextContract) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
});
//Home route
Route.get("/", async ({ response }: HttpContextContract) => {
  return response.redirect("api-docs");
});
Route.group(() => {
  authRoutes();
  userRoutes();
  tokenRoutes();
  imageRoutes();
  factoryRoutes();
  docRoutes();
}).prefix("api/v1");
