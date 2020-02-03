import Vue from "../js/vue-em.js"

Vue.component("add-category", {
    data: function () {
        return {
            category: {
                name: null,
                cores: null,
                ram: null,
                gpuCores: null
            },
            showModal: false,
            error: null,
            buttonText: "ADD"
        }
    },

    props: ["mode", "preCategory"],
    template: `

<div>
<button v-on:click="showModal = true" class="btn btn-primary shadow btn-lg add-button">{{buttonText}}</button>
<div v-if="showModal" v-on:click="showModal = false" class="unfocused"></div>
<div v-if="showModal" class="mymodal shadow" tabindex="-1">
  <div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Add a new VM category</h5>
        <button type="button" class="close" aria-label="Close" v-on:click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form id="add-form" ref="add" v-on:submit="checkAndSend" method="POST">

          <div class="modal-body">
            <div class="form-label-group">
                <input type="text" id="name" class="form-control" placeholder="Category name" v-model="category.name" required>
                <label for="name">Category name</label>

            </div>
            
            <div class="form-label-group">

                <input type="number" id="cores" class="form-control" max="100" placeholder="Amount of cores" v-model="category.cores" required>
                <label for="cores">Amount of cores</label>

            </div>
          
            <div class="form-label-group">

                <input type="number" id="ram" class="form-control" max="1000" placeholder="RAM Capacity" v-model="category.ram" required>
                <label for="ram">RAM Capacity</label>

            </div>
          
            <div class="form-label-group">

                <input type="number" id="gpucores" class="form-control" max="100" placeholder="Amount of GPU cores" v-model="category.gpuCores" required>
                <label for="gpucores">Amount of CPU cores</label>

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

            if (this.category.name.search(/[a-zA-Z][a-zA-Z0-9]+$/) === -1) {
                this.error = "Name cannot contain less than two lettters.";
            } else if (this.category.cores < 1) {
                this.error = "Category cannot contain less than one core";
            } else if (this.category.ram < 0.5) {
                this.error = "Category cannot contain less than 512 MB";
            } else if (this.category.gpuCores < 1) {
                this.error = "Category cannot contain less than one GPU core";

            } else {
                if (this.mode === "edit") {
                    this.edit(event);
                } else {
                    this.add(event);
                }
            }
        },
        add: function (event) {
            axios.post("/rest/category", this.category)
                .then(res => {
                    this.$router.go();
                })
                .catch(res => {
                    this.error = res.response.data.text;;
                });
        },
        edit: function (event) {
            axios.post("/rest/category/" + this.preCategory.name, this.category)
                .then(res => {
                    this.$router.push('/category/' + res.data.location).then(e => {
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
            if (this.preCategory == null) {
                this.category = {
                    name: null,
                    cores: null,
                    ram: null,
                    gpuCores: null
                };
                return;
            }
            this.category = Object.assign({}, this.preCategory);
        },
        resetModalWindow: function () {
            this.resetForm();
            this.showModal = false;
            this.$emit("edit");
        }
    },
    created() {
        if (this.mode === "edit") {
            if (this.user == null) {
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