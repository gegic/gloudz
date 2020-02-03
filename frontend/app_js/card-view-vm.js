import Vue from "../js/vue-em.js"


Vue.component("card-view-vm", {
    props: ['vm', 'organization'],

    methods: {
        pushToVm: function () {
            this.$router.push("vm/" + this.organization.name + '/' + this.vm.name);
        }
    },
    
    template: `
<div class="card mb-3 ml-3 mr-3 clickable-card" v-on:click="pushToVm">
  <div class="row no-gutters">
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">{{ vm.name }}</h5>
        <p class="card-text">Category {{vm.category.name}}.</p>
        <p class="card-text">Ram {{vm.category.ram}}GB.</p>
		<p class="card-text">Number of cores: {{vm.category.cores}}</p>
		<p class="card-text">Number of GPU Cores: {{vm.category.gpuCores}}</p>
        <p class="text-muted">More info</p>
      </div>
    </div>
  </div>
</div>

`
});