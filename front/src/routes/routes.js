import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Home from "@/pages/Home.vue";
import Maps from "@/pages/LocalMap.vue";
import Global from "@/pages/Global.vue";
import Local from "@/pages/Local.vue";
import Preventation from "@/pages/Preventation.vue";
import About from "@/pages/About.vue";
import MaskMap from "@/pages/MaskMap.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: Home
      },
      {
        path: "global",
        name: "Global",
        component: Global
      },
      {
        path: "local",
        name: "Local",
        component: Local
      },
      {
        path: "maps",
        name: "Maps",
        component: Maps
      },
      {
        path: "preventation",
        name: "Preventation",
        component: Preventation
      },
      {
        path: "about",
        name: "About",
        component: About
      },
      {
        path: "maskmap",
        name: "MaskMap",
        component: MaskMap
      }
    ]
  }
];

export default routes;
