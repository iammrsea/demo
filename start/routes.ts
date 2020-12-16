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
  tripRoutes,
  riderRoutes,
  driverRoutes,
  transactionRoutes,
  messageRoutes,
  reviewRoutes,
} from "./Routes/index";

//Health route
Route.get("health", async ({ response }: HttpContextContract) => {
  try {
    const report = await HealthCheck.getReport();
    return report.healthy ? response.ok(report) : response.badRequest(report);
  } catch (error) {
    throw error
  }
});
// Route.get('/', async ({ view }) => {
//   return view.render('welcome')
// })
//Home route
Route.get("/", async ({ response }: HttpContextContract) => {
  return response.redirect("api-docs");
});
Route.group(() => {
  authRoutes();
  userRoutes();
  tokenRoutes();
  imageRoutes();
  tripRoutes();
  riderRoutes();
  driverRoutes();
  transactionRoutes();
  messageRoutes();
  reviewRoutes();
  factoryRoutes();
  docRoutes();
}).prefix("api/v1");
