import Vue from "../js/vue-em.js"

Vue.component("organizations", {
    data: function () {
        return {
            organizations: null,
        }
    },
    template: `
<div >
    <sidebar activeTab="organizations"></sidebar>
    <div class="pt-3" id="page-wrapper">
        <card-view v-for="organization in organizations" v-bind:organization="organization"></card-view>
    </div>
    <add-organization/>
</div>

`,
    created(){
        axios.get('/rest/organizations').then(res => {
           this.organizations = res.data;
        });
    }

});