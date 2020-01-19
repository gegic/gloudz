import Vue from "../js/vue-em.js"

Vue.component("user", {
    data: function(){
        return {
            isLoading: false,
            user: null,
            activeUser: null,
        }
    },
    props: ['email'],
    created(){
        this.isLoading = true;
        axios.get('/rest/logged').then(response => {
            this.activeUser = response.data;
            axios.get('/rest/user/' + this.email).then(res => {
                this.user = res.data;
                this.isLoading = false;
            });
        });

    },
    methods:{
        edited: function () {
            axios.get('/rest/user/' + this.email).then(res => {
                this.user = res.data;
                this.$router.go();
            });
        }
    }
    ,
    template: `
<div v-if="!isLoading" class="p-0 m-0">
    <sidebar activeTab="users"></sidebar>
    <div class="pt-3" id="page-wrapper">
        <div class="container">
            <img v-if="user.role != 'superAdmin'" v-bind:src="user.organization.logoPath" class="logo">
            <img v-if="user.role == 'superAdmin'" src="data/imgs/superAdmin.png" class="logo">
            <h1>{{user.firstName}} {{user.lastName}}</h1>
            <p class="lead">Contact at {{user.email}}</p>
            <p class="lead">{{user.role}}</p>
            <p class="lead" v-if="user.role != 'superAdmin'">Works at {{user.organization.name}}</p>
        </div>
        <delete-user :user="user"></delete-user>
        <add-user mode="edit" :activeUser="activeUser" :preUser="user" @edit="edited"/>
    </div>
    
</div>

`

});