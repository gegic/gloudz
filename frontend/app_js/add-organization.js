import Vue from "../js/vue-em.js"

Vue.component("add-organization", {
    data: function () {
        return {
            name: null,
            description: null,
            showModal: false,
            error: null,
            buttonText: "ADD"
        }
    },

    props: ["mode", "organization"],
    template: `

<div>
<button v-on:click="showModal = true" class="btn btn-primary shadow btn-lg add-button">{{buttonText}}</button>
<div v-if="showModal" v-on:click="showModal = false" class="unfocused"></div>
<div v-if="showModal" class="mymodal shadow" tabindex="-1">
  <div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add a new organization</h5>
        <button type="button" class="close" aria-label="Close" v-on:click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form id="add-form" ref="add" v-on:submit="checkAndSend" method="POST">

          <div class="modal-body">
              <div class="logo-group">
                <label for="logo">Upload the organization logo</label>
                <input type="file" ref="logo" class="form-control-file" id="logo" name="logo" accept="image/png">
              </div>
              
              <div class="name-group">
                <label for="name">Organization name</label>
                <input type="text" id="name" name="name" v-model="name" required>
              </div>
              
              <div class="description-group">
                <label for="desc">Organization description</label>
                <textarea rows="4" cols="50" id="desc" name="desc" form="add-form" v-model="description" placeholder="Enter description.." required></textarea>
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
        checkAndSend: function(event) {
            event.preventDefault();
            this.error = null;
            if (this.name.search(/[a-zA-Z]*$/) === -1){
                this.error = "Name can only contain uppercase and lowercase letters";
            }
            else if (this.name.length < 5) {
                this.error = "Name cannot contain less than five characters.";
            } else if (this.description.length < 10) {
                this.error = "Description cannot contain less than ten characters.";
            } else {
                if (this.mode === "edit") {
                    this.edit(event);
                } else {
                    this.add(event);
                }
            }
        },
        add: function (event) {

            let formData = new FormData(this.$refs.add);
            if(formData.get("logo").size === 0){
                this.error = "Organization must contain a logo";
                return;
            }
            axios.post("/rest/organization", formData)
                 .then(res => {
                     this.$router.go();
                 })
                 .catch(res => {
                     this.error = "This name is already taken";
                 });
        },
        edit: function (event) {
            let formData = new FormData(this.$refs.add);
            axios.post("/rest/organization/" + this.organization.name, formData)
                .then(res => {
                    this.$router.push('/organization/' + res.data.location).then(e => {
                        this.resetModalWindow();
                    }).catch(e => {
                        this.resetModalWindow();

                    });;
                })
                .catch(res => {
                    this.error = "This name is already taken";
                });
        },
        resetForm: function () {
            if(this.organization == null) {
                this.name = null;
                this.description = null;
                this.error = null;
                return;
            }
            this.name = this.organization.name;
            this.description = this.organization.description;
        },
        resetModalWindow: function () {
            this.resetForm();
            this.showModal = false;
            this.$emit("edit");
        }
    },
    created() {
        if(this.mode === "edit"){
            if(this.organization == null){
                this.name = "ERROR";
                this.description = "ERROR";
            } else{
                this.name = this.organization.name;
                this.description = this.organization.description;
            }
            this.buttonText = "EDIT"
        } else{
            this.name = null;
            this.description = null;
        }
    }

});