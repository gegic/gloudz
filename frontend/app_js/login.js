import Vue from "../js/vue-em.js"

Vue.component("login", {
	data: function () {
		    return {
		    	email: null,
    			password: null,
    			error: null
		    }
	},
	template: `
<div class="container" id="login">
	<div class="row my-5">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin">
          <div class="card-body">
            <h5 class="card-title text-center">Login</h5>
            <form class="form-signin" v-on:submit="checkForm" method="POST">
              <div class="form-label-group">
                <input type="email" id="inputEmail" v-model="email" class="form-control" placeholder="Email" required autofocus>
                <label for="inputEmail">Email</label>
              </div>
              <div class="form-label-group">
                <input type="password" id="inputPassword" v-model="password" class="form-control" placeholder="Password" required>
                <label for="inputPassword">Password</label>
              </div>
          
              <div v-if="error != null" class="alert alert-warning" role="alert">
                {{error}}
              </div>
              <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Log in</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
`
	, 
	methods : {
		checkForm: function(event) {
			event.preventDefault();

			let email_prefix = this.email.substring(0, this.email.indexOf("@"));
			if(!email_prefix.charAt(0).match(/[a-zA-Z]/)){
				this.error = "Email must start with letter";
			}
			else if(email_prefix.search(/[^a-zA-Z0-9._]/) !== -1){
				this.error = "Email can only contain a-z, A-Z, \".\" or \"_\"";
			}
			else if(this.password.search(/[^\w]/) !== -1){
				this.error = "Password can only contain usual symbols.";
			}
			else if(this.password.length < 8) {
				this.error = "Password has to be at least 8 characters long";
			}

			axios.post("/rest/login", { email: this.email, password: this.password })
				 .then((response) => {
					 this.$router.push('/');
				 })
				.catch(e => {this.error = "User with these credentials not found."});

		}
	}
});