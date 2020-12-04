import OnlineBike from "App/Models/OnlineBike";
import OnlineTricycle from "App/Models/OnlineTricycle";

type MatchVehicle = OnlineTricycle & OnlineBike & {
    distanceFromReference: number;
    averageSpeed?: number;
    tripId?: number
}

export default MatchVehicle