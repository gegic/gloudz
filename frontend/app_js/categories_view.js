import Vue from "../js/vue-em.js"

Vue.component("categories", {
    data: function () {
        return {
            categories: null,
        }
    },
    template: `
<div >
    <sidebar activeTab="categories"></sidebar>
    <div class="pt-3" id="page-wrapper">
        <card-view-category v-for="category in categories" v-bind:category="category"></card-view-category>
    </div>
    <add-category/>
</div>

`,
    created(){
        axios.get('/rest/categories').then(res => {
           this.categories = res.data;
        });
    }

});