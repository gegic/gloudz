import Vue from "../js/vue-em.js"

Vue.component("drives", {
    data: function () {
        return {
            organizations: null,
            activeUser: null,
        }
    },
    template: `
<div >
    <sidebar activeTab="drives"></sidebar>
    
    <div v-for="organization in organizations" class="pt-3" id="page-wrapper">
        <h1 class="display-4 m-3" v-if="organization.drives.length > 0">{{organization.name}}</h1>
        <card-view-drive v-for="drive in organization.drives" :organization="organization" :drive="drive"></card-view-drive>
    </div>
    <add-drive :activeUser="activeUser" v-if="activeUser && activeUser.role != 'user'"/>
</div>

`,
    created(){
        axios.get('/logged').then(response => {
            this.activeUser = response.data;
            if(this.activeUser.role === 'superAdmin') {
                axios.get('/rest/organizations').then(res => {
                    this.organizations = res.data;
                });
            } else{
                this.organizations = [this.activeUser.organization];
            }
        });
    }

});