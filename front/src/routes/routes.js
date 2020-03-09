import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Home from "@/pages/Home.vue";
import Maps from "@/pages/Maps.vue";
import Global from "@/pages/Global.vue";
import Local from "@/pages/Local.vue";
import Preventation from "@/pages/Preventation.vue";
import About from "@/pages/About.vue";
import Test from "@/pages/test.vue";

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
        meta: {
          hideFooter: true
        },
        component: Test
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
      }
    ]
  }
];

export default routes;
