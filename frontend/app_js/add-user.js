import Vue from "../js/vue-em.js"

Vue.component("add-user", {
    data: function () {
        return {
            user: {
                email: null,
                firstName: null,
                lastName: null,
                password: null,
                role: null,
                organization: null
            },
            organizations: null,
            showModal: false,
            error: null,
            buttonText: "ADD"
        }
    },

    props: ["mode", "preUser", "self", "activeUser"],
    template: `

<div>
<button v-on:click="showModal = true" class="btn btn-primary shadow btn-lg add-button">{{buttonText}}</button>
<div v-if="showModal" v-on:click="showModal = false" class="unfocused"></div>
<div v-if="showModal" class="mymodal shadow" tabindex="-1">
  <div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add a new user</h5>
        <button type="button" class="close" aria-label="Close" v-on:click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form id="add-form" ref="add" v-on:submit="checkAndSend" method="POST">

          <div class="modal-body">
            <div class="form-label-group">
                <input type="text" id="first-name" class="form-control" placeholder="First name" v-model="user.firstName" required>
                <label for="first-name">First name</label>

            </div>
            
            <div class="form-label-group">

                <input type="text" id="last-name" class="form-control" placeholder="Last name" v-model="user.lastName" required>
                <label for="last-name">Last name</label>

            </div>
          
            <div class="form-label-group">

                <input type="email" id="email" class="form-control" placeholder="Email" v-model="user.email" :disabled="mode === 'edit' && !self" required>
                <label for="email">Email</label>

            </div>
          
            <div class="form-label-group">

                <input type="password" id="password" class="form-control" placeholder="Password" v-model="user.password" required>
                <label for="password">Password</label>

            </div>
          
          
            <div v-if="self" class="form-label-group">

                <input type="password" id="repassword" class="form-control" ref="repassword" placeholder="Repeat password" required>
                <label for="repassword">Repeat password</label>

            </div>
            <div v-if="!preUser || (preUser && preUser.role != 'superAdmin')" class="form-select">

                <select id="role" v-model="user.role" class="form-control" required>
                    <option value="" disabled selected>Select a role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            
            <div v-if="activeUser && activeUser.role == 'superAdmin'" class="form-select">     
                <select id="organization" v-model="user.organization" class="form-control" :disabled="mode === 'edit'" required>
                    <option value="" disabled selected>Select an organization</option>
                    <option v-for="organization in organizations" :value="organization">{{organization.name}}</option>
                </select>
            </div>
              
              <div v-if="error != null" class="alert alert-warning" role="alert">
                {{error}}
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" v-on:click="showModal = false">Close</button>
            <input type="submit" class="btn btn-primary" :value="buttonText">
          </div>
          
     </form>


    </div>
  </div>
</div>
</div>
`,
    watch: {
        showModal: function () {
            this.resetForm();
            if (this.showModal) {
                document.documentElement.style.overflow = 'hidden';
                return;
            }

            document.documentElement.style.overflow = 'auto';

        }
    },
    methods: {
        checkAndSend: function (event) {
            event.preventDefault();
            this.error = null;

            if (this.user.firstName.search(/[a-zA-Z][a-zA-Z]+$/) === -1) {
                this.error = "First name cannot contain less than two lettters.";
            } else if (this.user.lastName.search(/[a-zA-Z][a-zA-Z]+$/) === -1) {
                this.error = "First name cannot contain less than two lettters.";
            } else if (this.user.email.search(/[a-zA-Z0-9._]+@[a-zA-Z]+\.[a-zA-Z]+$/) === -1 && this.mode !== "edit") {
                this.error = "Email incorrect.";
            } else if (this.user.password.length < 8) {
                this.error = "Password has to be at lest 8 characters long";
            } else if (this.self && this.$refs.repassword.value !== this.user.password){
                this.error = "Password not verified.";

            } else {

                if(this.activeUser && (this.activeUser.role === 'admin' && this.activeUser.organization)){
                    this.user.organization = this.activeUser.organization;
                }

                if (this.mode === "edit") {
                    this.edit(event);
                } else {
                    this.add(event);
                }
            }
        },
        add: function (event) {
            axios.post("/rest/user", this.user)
                .then(res => {
                    this.$router.go();
                })
                .catch(res => {
                    this.error = "Server error occurred";
                    return;
                });
        },
        edit: function (event) {
            axios.post("/rest/user/" + this.preUser.email, this.user)
                .then(res => {
                    if(this.self) {
                        this.$router.push('/profile').then(e => {
                            this.resetModalWindow();
                        }).catch(e => {
                            this.resetModalWindow();

                        });
                    }
                    else {
                        this.$router.push('/user/' + res.data.location).then(e => {
                            this.resetModalWindow();

                        }).catch(e => {
                            this.resetModalWindow();

                        });
                    }

                })
                .catch(res => {
                    this.error = "Server error occurred";
                })
        },
        resetForm: function () {
            if (this.preUser == null) {
                this.user = {
                    email: null,
                    firstName: null,
                    lastName: null,
                    password: null,
                    role: null,
                    organization: null
                };
                return;
            }
            this.user = Object.assign({}, this.preUser);
        },
        resetModalWindow: function () {
            this.resetForm();
            this.showModal = false;
            this.$emit("edit");
        }
    },
    created() {
        axios.get('/rest/organizations').then(res => {
            this.organizations = res.data;
        });
        if (this.mode === "edit") {
            if (this.preUser == null) {
                this.user = {
                    email: "ERROR",
                    firstName: "ERROR",
                    lastName: "ERROR",
                    password: "ERROR",
                    role: "ERROR",
                    organization: "ERROR"
                };
            } else {
                this.resetForm();
            }
            this.buttonText = "EDIT"
        } else {
            this.resetForm();
        }
    }

});