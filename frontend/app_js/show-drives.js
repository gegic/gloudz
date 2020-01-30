import Vue from "../js/vue-em.js"

Vue.component("show-drives", {
    data: function () {
        return {
            vm: {
                name: null,
                category: null,
                drives: [],
                activities: [],
            },
            showModal: false,
            error: null,
        }
    },

    props: ["preVM", 'activeUser', 'organization'],
    template: `

<div>
<button v-on:click="showModal = true" class="btn btn-secondary shadow btn-lg fourth-button">DRIVES</button>
<div v-if="showModal" v-on:click="showModal = false" class="unfocused"></div>
<div v-if="showModal" class="mymodal shadow" tabindex="-1">
  <div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Drives for {{vm.name}}</h5>
        <button type="button" class="close" aria-label="Close" v-on:click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body activities">
            
            <table v-if="vm.drives && vm.drives.length > 0" class="table">
              <thead>
                <tr>
                  <th scope="col">Drive name</th>
                  <th scope="col">Capacity</th>
                  <th scope="col">Type</th>
                  <th v-if="activeUser && activeUser.role != 'user'" scope="col">Remove</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="drive in vm.drives">
                  <td>{{drive.name}}</td>
                  <td>{{drive.capacity}}</td>
                  <td>{{drive.type}}</td>
                  <td v-if="activeUser && activeUser.role != 'user'"><button type="button" class="btn btn-danger" @click="remove(drive)">Remove</button></td>
                </tr>
                
              </tbody>
            </table> 
            
            <p v-else class="lead m-3">There are no drives associated with this virtual machine.</p>
              
              
          </div>
          <div v-if="error != null" class="alert alert-warning" role="alert">
            {{error}}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" v-on:click="showModal = false">Close</button>
          </div>

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
        resetForm: function () {
            if (this.preVM == null) {
                this.vm = {
                    name: null,
                    category: null,
                    drives: [],
                    activities: [],
                };
                return;
            }
            this.vm = JSON.parse(JSON.stringify(this.preVM))
        },
        remove: function(drive){
        	axios.delete("/rest/drive/" + this.organization.name + "/" + drive.name)
            .then(res => {
                alert("Drive successfully deleted");
                this.$router.push("/vm/" + this.organization.name + "/" + this.vm.name, e => {this.$router.go();}, e => {this.$router.go();});
            })
        }
    },
    created() {
        if(!this.vm.drives)
            this.vm.drives = [];
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
        } else {
            this.resetForm();
        }
    }

});