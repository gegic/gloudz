import Vue from "../js/vue-em.js"

Vue.component("vm", {
    data: function(){
        return {
            isLoading: false,
            vm: null,
            organization: null,
            buttonText: "ON",
        }
    },
    props: ['vmName', 'orgName'],
    created(){
        this.isLoading = true;
        axios.get('/rest/logged').then(response => {
            this.activeUser = response.data;
            axios.get('/rest/vm/' + this.orgName + '/' + this.vmName).then(res => {
                let orgVm = res.data;
                this.vm = orgVm.first;
                this.organization = orgVm.second;
                if(this.vm.ongoingActivity) this.buttonText = "OFF";
                else this.buttonText = "ON";
                this.isLoading = false;
            });
        });
    },
    computed: {
        currentDate: function () {
            let d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }
    },
    methods:{
        working: function(){
            if(!this.vm.ongoingActivity){
                this.buttonText = "OFF";
                this.vm.ongoingActivity = {startingDate: this.currentDate, endingDate: null};
            } else{
                this.buttonText = "ON";
                this.vm.ongoingActivity.endingDate = this.currentDate;
                this.vm.activities.push(JSON.parse(JSON.stringify(this.vm.ongoingActivity)));
                delete this.vm.ongoingActivity;
            }
            axios.post("/rest/vm/" + this.organization.name + '/' + this.vm.name, this.vm)
                .then(res => {
                    this.$router.push('/vm/' + res.data.location).then(e => {
                        this.edited();

                    }).catch(e => {
                        this.edited();

                    });

                })
                .catch(res => {
                    this.error = "Server error occurred";
                });
        },
        edited: function () {
            axios.get('/rest/vm/' + this.orgName + '/' + this.vmName).then(res => {
                let orgVm = res.data;
                this.vm = orgVm.first;
                this.organization = orgVm.second;
                this.$router.go();

            });
        }
    }
    ,
    template: `
<div v-if="!isLoading" class="p-0 m-0">
    <sidebar activeTab="vm"></sidebar>
    <div class="pt-3" id="page-wrapper">
        <div class="container">
            <h1>{{vm.name}}</h1>
            <p class="lead">Sold to organization {{organization.name}}</p>
            <p class="lead">Is of category {{vm.category.name}}</p>
            <p class="lead">Has {{vm.category.cores}} cores.</p>
            <p class="lead">Has {{vm.category.ram}}GB RAM.</p>
            <p class="lead">Has {{vm.category.gpuCores}} GPU cores.</p>
            <button class="btn btn-warning shadow btn-lg" @click="working">{{buttonText}}</button>

        </div>
        <add-vm :activeUser="activeUser" v-if="activeUser && activeUser.role != 'user'" mode="edit" :organization="organization" :preVM="vm" @edit="edited"/>
        <delete-vm v-if="activeUser && activeUser.role != 'user'" :vm="vm" :organization="organization"/>
    </div>
    
</div>

`

});