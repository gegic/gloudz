import Vue from "../js/vue-em.js"

Vue.component("vms", {
    data: function () {
        return {
            filterData: {
                cores: {min: 0, max: 100},
                ram: {min: 0, max: 1000},
                gpuCores: {min: 0, max: 100},
            },
            foundOrganizations: null,
            organizations: null,
            activeUser: null,
            searched: null,
        }
    },
    props: [],
    methods: {
        filter: function (event){
            this.filterData = event;
            this.search();
        },
        search: function (event) {
            if(event)
                event.preventDefault();
            let re;
            if(this.searched)
                re = new RegExp(this.searched, 'i');
            this.foundOrganizations = JSON.parse(JSON.stringify(this.organizations));
            for(let i in this.organizations){
                if(this.organizations[i].machines) {
                    this.foundOrganizations[i].machines = this.organizations[i].machines.filter(el => {
                        let satCores = el.category.cores >= this.filterData.cores.min && el.category.cores <= this.filterData.cores.max;
                        let satRam = el.category.ram >= this.filterData.ram.min && el.category.ram <= this.filterData.ram.max;
                        let satGpuCores = el.category.gpuCores >= this.filterData.gpuCores.min && el.category.gpuCores <= this.filterData.gpuCores.max;
                        let satName;
                        if (this.searched)
                            satName = el.name.search(re) !== -1;
                        else satName = true;
                        return satCores && satRam && satGpuCores && satName;
                    });
                }
            }
        }
    },
    template: `
<div >
    <sidebar :activeUser="activeUser" activeTab="vm" v-model:user="activeUser"></sidebar>
    <div class="pt-3" id="page-wrapper">
        <form class="form-label-group m-3 min" @submit="search" >
            <input type="text" id="search" class="form-control searchbar" placeholder="Search" v-model="searched" maxlength="40" autocomplete="off">
            <button type="submit" class="btn btn-primary search-button" value="SEARCH">SEARCH</button>
            <filter-vm :filterData="filterData" @filtered="filter"/>
            <label for="search">Search</label>
        </form>
        <div v-for="organization in foundOrganizations" >
            <h1 class="display-4 m-3" v-if="organization.machines.length > 0">{{organization.name}}</h1>
            <card-view-vm v-for="vm in organization.machines" :organization="organization" :vm="vm"></card-view-vm>
        </div>
    </div>
    <add-vm :activeUser="activeUser" v-if="activeUser && activeUser.role != 'user'"/>
</div> 

`,
    created(){
        axios.get('/logged').then(response => {
            this.activeUser = response.data;
            if(this.activeUser.role === 'superAdmin') {
                axios.get('/rest/organizations').then(res => {
                    this.organizations = res.data;
                    this.foundOrganizations = this.organizations;
                });
            } else{
                this.organizations = [this.activeUser.organization];
                this.foundOrganizations = this.organizations;
            }
        });

    }

});