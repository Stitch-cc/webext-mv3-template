import { createRouter, createWebHashHistory } from 'vue-router'

const createRoutes = () => {
    return [
        {
            path: '/',
            name: 'Home',
            meta: { requiresAuth: true, useWindowNavigate: true },
            component: () => import('~/views/Home.vue')
        },
        {
            path: '/settings',
            name: 'Settings',
            meta: { requiresAuth: true },
            component: () => import('~/views/Setting.vue')
        },
        {
            path: '/about',
            name: 'About',
            meta: { requiresAuth: false },
            component: () => import('~/views/About.vue')
        },
        {
            path: '/login',
            name: 'Login',
            meta: { requiresAuth: false, useWindowNavigate: true },
            component: () => import('~/views/Login.vue')
        },
        {
            path: '/subscribe',
            name: 'Subscribe',
            meta: { requiresAuth: true },
            component: () => import('~/views/Subscribe.vue')
        },
        {
            path: '/unsubscribe',
            name: 'Unsubscribe',
            meta: { requiresAuth: true },
            component: () => import('~/views/Unsubscribe.vue')
        }
    ]
};

const router = createRouter({
    history: createWebHashHistory(),
    routes: createRoutes()
});

import { useProfileState } from '~/store';
router.beforeEach((to, from, next) => {
    const isAuthenticated = Boolean(useProfileState().value);
    if (to.meta.requiresAuth && !isAuthenticated) next({ name: 'Login' })
    else next()
})

export default router;