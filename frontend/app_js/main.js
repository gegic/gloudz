import Vue from "../js/vue-em.js"
import VueRouter from "../js/vue-router.js"
Vue.use(VueRouter);

const router = new VueRouter(
    {
        mode: 'hash',
        routes: [
            {
                path: '/',
                component: {template: '<vms></vms>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false,
                }
            },
            {
                path: '/login',
                component: {template: '<login></login>'},
                meta: {
                    public: true,  // Allow access to even if not logged in
                    whenLoggedOut: true
                }
            },
            {
                path: '/logout',
                component: {template: '<logout></logout>'},
                meta: {
                    public: true,  
                    whenLoggedOut: false
                }
            },
            {
                path: '/organizations',
                component: {template: '<organizations></organizations>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
                }
            },
            {
                path: '/users',
                component: {template: '<users></users>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
                }
            },
            {
                path: '/profile',
                component: {template: '<profile></profile>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
                }
            },
            {
                path: '/drives',
                component: {template: '<drives></drives>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
                }
            },
            {
                path: '/organization/:name',
                component: {template: '<organization :name="$route.params.name"></organization>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
                }
            },
            {
                path: '/user/:email',
                component: {template: '<user :email="$route.params.email"></user>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
                }
            },
            {
                path: '/categories',
                component: {template: '<categories></categories>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
                }
            },
            {
                path: '/category/:name',
                component: {template: '<category :name="$route.params.name"></category>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
                }
            },
            {
                path: '/vm/:orgName/:vmName',
                component: {template: '<vm :orgName="$route.params.orgName" :vmName="$route.params.vmName"></vm>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
                }
            },
            {
                path: '/drive/:orgName/:driveName',
                component: {template: '<drive :orgName="$route.params.orgName" :driveName="$route.params.driveName"></drive>'},
                meta: {
                    public: false,  // Allow access to even if not logged in
                    whenLoggedOut: false
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
        else if (to.path === '/organizations' || to.path === '/categories'){
        	let activeUser = response.data;
        	if (activeUser.role !== 'superAdmin'){
        		next('/');
        	} else{
        		next();
        	}
        }
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

