import Vue from 'vue'
import Router from 'vue-router'

// load all views from the ./client/views directory
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Users from './views/Users.vue';
import User from './views/User.vue';
import MarathonMap from './views/MarathonMap.vue';
import RunList from './views/RunList.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/users',
            name: 'users',
            component: Users
        },
        {
            path: '/users/:username',
            name: 'user',
            component: User,
            props: true
        },
        {
            path: '/marathonmap',
            name: 'marathonmaplist',
            component: MarathonMap
        },
        {
            path: '/runlist',
            name: 'runnerlist',
            component: RunList
        }
    ]
});