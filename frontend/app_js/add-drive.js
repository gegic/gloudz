import Vue from "../js/vue-em.js"

Vue.component("add-drive", {
    data: function () {
        return {
            drive: {
                name: null,
                capacity: null,
                type: null,
            },
            selectedVM: null,
            selectedOrganization: null,
            organizations: null,
            showModal: false,
            error: null,
            buttonText: "ADD"
        }
    },

    props: ["mode", "preDrive", 'vm', 'organization', "activeUser"],
    template: `

<div>
<button v-on:click="showModal = true" class="btn btn-primary shadow btn-lg add-button">{{buttonText}}</button>
<div v-if="showModal" v-on:click="showModal = false" class="unfocused"></div>
<div v-if="showModal" class="mymodal shadow" tabindex="-1">
  <div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add a new Drive</h5>
        <button type="button" class="close" aria-label="Close" v-on:click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form id="add-form" ref="add" v-on:submit="checkAndSend" method="POST">

          <div class="modal-body">
            <div class="form-label-group">
                <input type="text" id="name" class="form-control" placeholder="Drive name" v-model="drive.name" required>
                <label for="name">Drive name</label>

            </div>
            
            <div class="form-label-group">
                <input type="number" id="capacity" class="form-control" placeholder="Capacity" v-model="drive.capacity" required>
                <label for="capacity">Capacity</label>
            </div>
            
            <div class="form-select">     
                <select id="type" v-model="drive.type" class="form-control" required>
                    <option value="" disabled selected>Select a type</option>
                    <option value="hdd">HDD</option>
                    <option value="ssd">SSD</option>
                </select>
            </div>
            
            <div v-if="mode !== 'edit' && (activeUser && activeUser.role == 'superAdmin')" class="form-select">     
                <select id="organization" v-model="selectedOrganization" class="form-control" required>
                    <option value="" disabled selected>Select an organization</option>
                    <option v-for="organization in organizations" :value="organization">{{organization.name}}</option>
                </select>
            </div>      
            
            <div class="form-select" v-if="selectedOrganization">     
                <select id="vm" v-model="selectedVM" class="form-control" required>
                    <option value="" disabled selected>Select a virtual machine</option>
                    <option v-for="vm in selectedOrganization.machines" :value="vm">{{vm.name}}</option>
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

            if (false) {
                this.error = "Name cannot contain less than two lettters.";

            } else {
                if (this.mode === "edit") {
                    this.edit(event);
                } else {
                    this.add(event);
                }
            }
        },
        add: function (event) {
            let sendingData = {first: {first: this.drive, second: this.selectedVM}, second: this.selectedOrganization};
            axios.post("/rest/drive", sendingData)
                .then(res => {
                    this.$router.go();
                })
                .catch(res => {
                    this.error = "Server error occurred";
                });
        },
        edit: function (event) {
            axios.post("/rest/drive/" + this.organization.name + '/' + this.preDrive.name, {first: this.drive, second: this.selectedVM})
                .then(res => {
                    this.$router.push('/drive/' + res.data.location).then(e => {
                        this.resetModalWindow();
                    }).catch(e => {
                        this.resetModalWindow();

                    });;

                })
                .catch(res => {
                    this.error = "Server error occurred";
                });
        },
        resetForm: function () {
            if (this.preDrive == null) {
                this.drive = {
                    name: null,
                    capacity: null,
                    type: null,
                };
                this.selectedVM = null;
                if(this.activeUser && this.activeUser.role !== 'superAdmin'){
                    this.selectedOrganization = this.activeUser.organization;
                }else {
                    this.selectedOrganization = null;
                }
                return;
            }
            this.drive = Object.assign({}, this.preDrive);
            this.selectedVM = Object.assign({}, this.vm);
            this.selectedOrganization = Object.assign({}, this.organization);
        },
        resetModalWindow: function () {
            this.resetForm();
            this.showModal = false;
            this.$emit("edit");
        }
    },
    created(){
        if(this.activeUser && this.activeUser.role === 'superAdmin') {
            axios.get('/rest/organizations').then(res => {
                this.organizations = res.data;
            });
        } else {
            this.organizations = [this.activeUser.organization];
        }

        if (this.mode === "edit") {
            if (this.preDrive == null) {
                this.drive = {
                    name: "ERROR",
                    capacity: "ERROR",
                    type: "ERROR",
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