import Vue from "../js/vue-em.js"


Vue.component("card-view", {
    data: function () {
        return {
        }
    },
    props: ['organization', 'isClickable'],

    methods: {
        pushToOrganization: function () {
            this.$router.push("organization/" + this.organization.name);
        }
    },
    
    template: `
<div class="card mb-3 ml-3 mr-3" v-bind:class="{'clickable-card': isClickable}" v-on:click="pushToOrganization">
  <div class="row no-gutters">
    <div class="col-ld-3">
      <img v-bind:src="organization.logoPath" class="logo">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">{{ organization.name }}</h5>
        <p class="card-text">{{ organization.description }}</p>
        <p v-if="isClickable" class="text-muted">More info</p>
      </div>
      
      <table>
      
</table>
    </div>
  </div>
</div>

`
});