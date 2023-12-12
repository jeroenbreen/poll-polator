import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Main from "@/pages/Main.vue";
import Mission from "@/pages/Mission.vue";
import Grid from "@/pages/Grid.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Main",
        component: Main,
    },
    {
        path: "/about",
        name: "Mission",
        component: Mission,
    },
    {
        path: "/uitleg-grid",
        name: "Grid",
        component: Grid,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
