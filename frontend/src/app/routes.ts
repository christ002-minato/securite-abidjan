import { createBrowserRouter } from "react-router";
import { MapView } from "./components/MapView";
import { TripPlannerPage } from "./components/TripPlannerPage";
import { SignalPage } from "./components/SignalPage";
import { StatsPage } from "./components/StatsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MapView,
  },
  {
    path: "/planifier",
    Component: TripPlannerPage,
  },
  {
    path: "/signaler",
    Component: SignalPage,
  },
  {
    path: "/statistiques",
    Component: StatsPage,
  },
]);