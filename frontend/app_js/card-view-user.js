import Vue from "../js/vue-em.js"


Vue.component("card-view-user", {
    props: ['user'],

    methods: {
        pushToUser: function () {
            this.$router.push("user/" + this.user.email);
        }
    },
    
    template: `
<div class="card mb-3 ml-3 mr-3 clickable-card" v-on:click="pushToUser">
  <div class="row no-gutters">
    <div class="col-ld-3">
      <img v-if="user.role != 'superAdmin'" v-bind:src="user.organization.logoPath" class="logo">
      <img v-if="user.role == 'superAdmin'" src="data/imgs/superAdmin.png" class="logo">

    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">{{ user.firstName }} {{ user.lastName}}</h5>
        <p v-if="user.role != 'superAdmin'" class="card-text">Employed at {{user.organization.name}}</p>
        <p class="card-text">Email {{user.email}}</p>
        <p class="text-muted">More info</p>
      </div>
    </div>
  </div>
</div>

`
});