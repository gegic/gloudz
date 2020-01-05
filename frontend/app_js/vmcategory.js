import Vue from "../js/vue-em.js"

Vue.component("category", {
    data: function(){
        return {
            isLoading: false,
            category: null,
        }
    },
    props: ['name'],
    created(){
        this.isLoading = true;
        axios.get('/rest/category/' + this.name).then(res => {
            this.category = res.data;
            this.isLoading = false;
        });
    },
    methods:{
        edited: function () {
            axios.get('/rest/category/' + this.name).then(res => {
                this.category = res.data;
                this.$router.go();

            });
        }
    }
    ,
    template: `
<div v-if="!isLoading" class="p-0 m-0">
    <sidebar activeTab="categories"></sidebar>
    <div class="pt-3" id="page-wrapper">
        <div class="container">
            <h1>{{category.name}}</h1>
            <h2>Has {{category.cores}} cores.</h2>
            <h2>Has {{category.ram}}GB RAM.</h2>
            <h2>Has {{category.gpuCores}} GPU cores.</h2>
        </div>
        <add-category mode="edit" :preCategory="category" @edit="edited"/>
        <delete-category :category="category"/>
    </div>
    
</div>

`

});