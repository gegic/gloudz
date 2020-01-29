import Vue from "../js/vue-em.js"

Vue.component("drive", {
    data: function(){
        return {
            isLoading: false,
            drive: null,
            vm: null,
            organization: null,
            activeUser: null,
        }
    },
    props: ['driveName', 'orgName'],
    created(){
        this.isLoading = true;

        axios.get('/rest/logged').then(response => {
            this.activeUser = response.data;
            axios.get('/rest/drive/' + this.orgName + '/' + this.driveName).then(res => {
                let orgDrive = res.data;
                this.drive = orgDrive.first;
                this.organization = orgDrive.second.second;
                this.vm = orgDrive.second.first;
                this.isLoading = false;
            });
        });

    },
    methods:{
        edited: function () {
            axios.get('/rest/drive/' + this.orgName + '/' + this.driveName).then(res => {
                let orgDrive = res.data;
                this.drive = orgDrive.first;
                this.organization = orgDrive.second.second;
                this.vm = orgDrive.second.first;
                this.$router.go();
            });
        }
    }
    ,
    template: `
<div v-if="!isLoading" class="p-0 m-0">
    <sidebar activeTab="drives"></sidebar>
    <div class="pt-3" id="page-wrapper">
        <div class="container">
            <h1>{{drive.name}}</h1>
            <p class="lead">Sold to organization {{organization.name}}</p>
            <p class="lead">Has capacity of {{drive.capacity}}</p>
            <p class="lead">Is of type {{drive.type}}</p>
            <p class="lead" v-if="vm">Is attached to the {{vm.name}}.</p>
        </div>
        <add-drive :activeUser="activeUser" v-if="activeUser && activeUser.role != 'user'" mode="edit" :organization="organization" :preDrive="drive" :vm="vm" @edit="edited"/>
        <delete-drive v-if="activeUser && activeUser.role != 'user'" :drive="drive" :organization="organization"/>
    </div>
    
</div>

`

});