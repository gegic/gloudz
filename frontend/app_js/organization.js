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
        },
        pushToVm: function (vm) {
            this.$router.push("/vm/" + this.organization.name + '/' + vm.name);
        },
        pushToDrive: function (drive){
            this.$router.push("/drive/" + this.organization.name + '/' + drive.name);
        }
    }
    ,
    template: `
<div v-if="!isLoading" class="p-0 m-0">
    <sidebar activeTab="organizations"></sidebar>
    <div class="pt-3" id="page-wrapper">
        <div class="container">
        
        <card-view :organization="organization"></card-view>
        
        <table class="centered-table" cellpadding="10">
        <tr><td>
        <p class="lead">Virtual Machines</p>
        </td>
        <td>
        <p class="lead">Drives</p>

        </td></tr>
        <tr><td valign="top">
            <table v-if="organization.machines && organization.machines.length > 0" class="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Category</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="machine in organization.machines" v-on:click="pushToVm(machine)">
                  <td>{{machine.name}}</td>
                  <td>{{machine.category.name}}</td>
                </tr>
                
              </tbody>
            </table> 
            <p v-else class="lead">No machines associated with this organization.</p>

        </td>
        <td valign="top">
            <table v-if="organization.drives && organization.drives.length > 0" class="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Capacity</th>
                  <th scope="col">Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="drive in organization.drives" @click="pushToDrive(drive)">
                  <td>{{drive.name}}</td>
                  <td>{{drive.capacity}}</td>
                  <td>{{drive.type}}</td>
                </tr>
                
              </tbody>
            </table> 
            <p v-else class="lead">No drives associated with this organization.</p>
        </td>
        </td>
        
        </tr>
        
        </table>
        </div>
        <add-organization mode="edit" :organization="organization" @edit="edited"/>
    </div>
    
</div>

`

});