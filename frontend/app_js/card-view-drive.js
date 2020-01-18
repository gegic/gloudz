import Vue from "../js/vue-em.js"


Vue.component("card-view-drive", {
    props: ['drive', 'organization'],

    methods: {
        pushToDrive: function () {
            this.$router.push("drive/" + this.organization.name + '/' + this.drive.name);
        }
    },
    
    template: `
<div class="card mb-3 ml-3 mr-3 clickable-card" v-on:click="pushToDrive">
  <div class="row no-gutters">
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">{{ drive.name }}</h5>
        <p class="card-text">Capacity {{drive.capacity}}.</p>
        <p class="card-text">Type {{drive.type}}.</p>

        <p class="text-muted">More info</p>
      </div>
    </div>
  </div>
</div>

`
});