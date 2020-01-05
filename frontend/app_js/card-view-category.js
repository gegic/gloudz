import Vue from "../js/vue-em.js"


Vue.component("card-view-category", {
    props: ['category'],

    methods: {
        pushToCategory: function () {
            this.$router.push("category/" + this.category.name);
        }
    },
    
    template: `
<div class="card mb-3 ml-3 mr-3 clickable-card" v-on:click="pushToCategory">
  <div class="row no-gutters">
    <div class="col-ld-3">
      <div class="card-body">
        <h5 class="card-title">{{ category.name }}</h5>
        <p class="card-text">Has {{category.cores}} cores.</p>
        <p class="card-text">Has {{category.ram}}GB RAM.</p>
        <p class="card-text">Has {{category.gpuCores}} GPU cores.</p>
        <p class="text-muted">More info</p>
      </div>
    </div>
  </div>
</div>

`
});