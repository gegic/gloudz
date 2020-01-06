import Vue from "../js/vue-em.js"

Vue.component("users", {
    data: function () {
        return {
            users: null,
            activeUser: null,
        }
    },
    props: [],
    template: `
<div>
    <sidebar activeTab="users"></sidebar>
    <div v-if="users" class="pt-3" id="page-wrapper">
        <card-view-user v-for="user in users" :user="user"></card-view-user>
    </div>
    <add-user :activeUser="activeUser"/>
</div>

`,
    created(){
        axios.get('/rest/logged').then(response => {
            this.activeUser = response.data;
            if(this.activeUser.role === 'superAdmin') {
                axios.get('/rest/users').then(res => {
                    this.users = res.data;
                });
            } else {
                if (this.activeUser.organization) {
                    axios.get('/rest/users/' + this.activeUser.organization.name).then(res => {
                        this.users = res.data;
                    });
                }
            }

        });

    }

});