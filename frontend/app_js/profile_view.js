import Vue from "../js/vue-em.js"

Vue.component("profile", {
    data: function () {
        return {
            isLoading: false,
            user: null,
        }
    },
    created(){
        this.isLoading = true;
        axios.get("/rest/logged").then(res => {
            this.user = res.data;
            this.isLoading = false;
        });
    },
    methods:{
        edited: function () {
            axios.get('/rest/user/' + this.email).then(res => {
                this.user = res.data;
                this.$router.go();
            })
        }
    },
    template: `
<div v-if="!isLoading">
    <sidebar activeTab="profile"></sidebar>
    <div class="pt-3" id="page-wrapper">
        <div class="container">
            <h1>{{user.firstName}} {{user.lastName}}</h1>
            <h2>Contact at {{user.email}}</h2>
            <img v-if="user.role != 'superAdmin'" v-bind:src="user.organization.logoPath" class="logo">
            <img v-if="user.role == 'superAdmin'" src="data/organization_logos/logo.png" class="logo">
            <h2>{{user.role}}</h2>
            <h2 v-if="user.role != 'superAdmin'">Works at {{user.organization.name}}</h2>
        </div>
        <add-user mode="edit" self="true" :activeUser="user" :preUser="user" @edit="edited"/>
    </div>
</div>
`

});