import Vue from "../js/vue-em.js"

Vue.component("add-vm", {
    data: function () {
        return {
            vm: {
                name: null,
                category: null,
                drives: [],
                activities: [],
            },
            selectedOrganization: null,
            organizations: null,
            categories: null,
            showModal: false,
            error: null,
            buttonText: "ADD"
        }
    },

    props: ["mode", "preVM", 'organization', "activeUser"],
    template: `

<div>
<button v-on:click="showModal = true" class="btn btn-primary shadow btn-lg add-button">{{buttonText}}</button>
<div v-if="showModal" v-on:click="showModal = false" class="unfocused"></div>
<div v-if="showModal" class="mymodal shadow" tabindex="-1">
  <div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add a new Virtual Machine</h5>
        <button type="button" class="close" aria-label="Close" v-on:click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form id="add-form" ref="add" v-on:submit="checkAndSend" method="POST">

          <div class="modal-body">
            <div class="form-label-group">
                <input type="text" id="name" class="form-control" placeholder="Virtual Machine name" v-model="vm.name" required>
                <label for="name">Virtual Machine name</label>

            </div>
            
            <div class="form-select">     
                <select id="category" v-model="vm.category" class="form-control" required>
                    <option value="null" disabled selected>Select a category</option>
                    <option v-for="category in categories" :value="category">{{category.name}} with {{category.cores}} cores, {{category.ram}}GB RAM</option>
                </select>
            </div>     
            
            <div v-if="mode !== 'edit' && (activeUser && activeUser.role == 'superAdmin')" class="form-select">
                <select id="organization" v-model="selectedOrganization" class="form-control" required>
                    <option value="null" disabled selected>Select an organization</option>
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

            if (this.vm.name.search(/[a-zA-Z][a-zA-Z0-9]+$/) === -1) {
                this.error = "Name cannot contain less than two lettters.";

            } 
            else if (this.vm.category === null){
                this.error = "Virtual machine has to belong to a category";

            }
            else if (this.selectedOrganization === null && this.mode !== 'edit' && this.activeUser.role != 'admin'){
                this.error = "Virtual machine has to belong to an organization";

            }
            
            else {
                if(this.activeUser && this.activeUser.role === 'admin'){
                    this.selectedOrganization = this.activeUser.organization;
                }
                if (this.mode === "edit") {
                    this.edit(event);
                } else {
                    this.add(event);
                }
            }
        },
        add: function (event) {
            let sendingData = {first: this.vm, second: this.selectedOrganization};
            axios.post("/rest/vm", sendingData)
                .then(res => {
                    this.$router.go();
                })
                .catch(res => {
                    this.error = res.response.data.text;;
                });
        },
        edit: function (event) {
            axios.post("/rest/vm/" + this.organization.name + '/' + this.preVM.name, this.vm)
                .then(res => {
                    this.$router.push('/vm/' + res.data.location).then(e => {
                        this.resetModalWindow();
                    }).catch(e => {
                        this.resetModalWindow();

                    });;

                })
                .catch(res => {
                    this.error = res.response.data.text;;
                });
        },
        resetForm: function () {
            if (this.preVM == null) {
                this.vm = {
                    name: null,
                    category: null
                };
                return;
            }
            this.vm = Object.assign({}, this.preVM);
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
        axios.get('/rest/categories').then(res => {
            this.categories = res.data;
        });
        if (this.mode === "edit") {
            if (this.preVM == null) {
                this.vm = {
                    name: "ERROR",
                    category: "ERROR",
                    drives: [],
                    activities: [],
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