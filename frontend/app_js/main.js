import Vue from "../js/vue-em.js"
import VueRouter from "../js/vue-router.js"
Vue.use(VueRouter);

const router = new VueRouter(
    {
        mode: 'hash',
        routes: [
            {
                path: '/',
                component: {template: '<h1>LOGGED</h1>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
                }
            },
            {
                path: '/login',
                component: {template: '<login></login>'},
                meta: {
                    public: true,  // Allow access to even if not logged in
                    whenLoggedOut: true
                }
            }

        ]
    }
);

router.beforeEach((to, from, next) => {
    axios.get('/rest/logged').then(response => {
        let loggedIn = response.data !== "";
        
        const isPublic = to.matched.some(record => record.meta.public);
        const whenLoggedOut = to.matched.some(record => record.meta.whenLoggedOut);

        if (!loggedIn && !isPublic)
            next('/login');
        else if (loggedIn && whenLoggedOut)
            next('/');
        else
            next();
    })
});


let app = new Vue(
    {
        router,
        el: '#gloudz'
    }
);

