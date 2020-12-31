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
import NotificationService from "App/Services/NotificationService";

//Health route
Route.get("health", async ({ response }: HttpContextContract) => {
  try {
    const report = await HealthCheck.getReport();
    return report.healthy ? response.ok(report) : response.badRequest(report);
  } catch (error) {
    throw error
  }
});

Route.post('api/v1/notify', async ({ request }) => {
  const { token, data } = request.all();
  const message = { token, data };
  console.log('payload', { token, data });
  try {
    const res = await NotificationService.notifyUser(message);
    console.log('res', res);
    return res;
  } catch (e) {
    console.log('error', e.message);
    return { is_success: false };
  }

})
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
