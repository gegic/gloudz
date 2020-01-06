import Vue from "../js/vue-em.js"

Vue.component("organization", {
    data: function(){
        return {
            isLoading: false,
            organization: null,
        }
    },
    props: ['name'],
    created(){
        this.isLoading = true;
        axios.get('/rest/organization/' + this.name).then(res => {
            this.organization = res.data;
            this.isLoading = false;
        });
    },
    methods:{
        edited: function () {
            axios.get('/rest/organization/' + this.name).then(res => {
                this.organization = res.data;
                this.$router.go();

            });
        }
    }
    ,
    template: `
<div v-if="!isLoading" class="p-0 m-0">
    <sidebar activeTab="organizations"></sidebar>
    <div class="pt-3" id="page-wrapper">
        <div class="container">
            <h1>{{organization.name}}</h1>
            <h2>{{organization.description}}</h2>
            <img v-bind:src="organization.logoPath" class="logo">
        </div>
        <add-organization mode="edit" :organization="organization" @edit="edited"/>
    </div>
    
</div>

`

});