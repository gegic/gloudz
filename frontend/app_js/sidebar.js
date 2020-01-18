import Vue from "../js/vue-em.js"

Vue.component("sidebar", {
    data: function () {
        return {
            activeUser: null,
        }
    },
    props: ['activeTab'],
    created(){
        axios.get('/rest/logged').then(response => {
            this.activeUser = response.data;
        });
    },
    template: `
    <div class="border-right" id="sidebar-wrapper">
      <div class="sidebar-heading">GloudZ</div>
      <div class="list-group list-group-flush">
        <router-link to="/" class="list-group-item list-group-item-action" v-bind:class="{active:activeTab=='vm'}">Virtual Machines</router-link>
        <router-link v-if="activeUser && activeUser.role == 'superAdmin'" to="/organizations" class="list-group-item list-group-item-action" v-bind:class="{active:activeTab=='organizations'}">Organizations</router-link>
        <router-link v-if="activeUser && activeUser.role == 'admin' && activeUser.organization" :to="'/organization/' + activeUser.organization.name" class="list-group-item list-group-item-action" v-bind:class="{active:activeTab=='organizations'}">Organizations</router-link>
        <router-link v-if="activeUser && activeUser.role != 'user'" to="/users" class="list-group-item list-group-item-action" v-bind:class="{active:activeTab=='users'}">Users</router-link>
        <router-link to="/drives" class="list-group-item list-group-item-action" v-bind:class="{active:activeTab=='drives'}">Drives</router-link>
        <router-link to="/profile" class="list-group-item list-group-item-action" v-bind:class="{active:activeTab=='profile'}">Profile</router-link>
        <router-link to="/categories" class="list-group-item list-group-item-action" v-bind:class="{active:activeTab=='categories'}">VM Categories</router-link>

        <router-link to="/logout" class="list-group-item list-group-item-action">Logout</router-link>
      </div>
    </div>
`,
    methods : {}

});