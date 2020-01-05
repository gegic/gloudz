import Vue from "../js/vue-em.js"

Vue.component("logout", {
    template: `
<p>LOGGING OUT...</p>
`,
    created(){
        axios.get('/rest/logout').then(this.$router.push('/login'));
    }

});