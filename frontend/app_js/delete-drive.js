import Vue from "../js/vue-em.js"

Vue.component("delete-drive", {
    data: function () {
        return {
            showModal: false,
        }
    },

    props: ["drive", "organization"],
    watch: {
        showModal: function () {
            if (this.showModal) {
                document.documentElement.style.overflow = 'hidden';
                return;
            }

            document.documentElement.style.overflow = 'auto';

        }
    },
    methods: {
        deleteMachine: function () {
            axios.delete("/rest/drive/" + this.organization.name + "/" + this.drive.name)
                .then(res => {
                    alert(res.data.text);
                    this.$router.push("/drives");
                })
        }
    },
    template: `

<div>
<button v-on:click="showModal = true" class="btn btn-danger shadow btn-lg delete-button">DELETE</button>
<div v-if="showModal" v-on:click="showModal = false" class="unfocused"></div>
<div v-if="showModal" class="mymodal shadow" tabindex="-1">
  <div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Delete {{drive.name}}</h5>
        <button type="button" class="close" aria-label="Close" v-on:click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      

          <div class="modal-body">
            <p>Are you sure you want to delete drive {{drive.name}}?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" v-on:click="showModal = false">Close</button>
            <button type="button" class="btn btn-danger" v-on:click="deleteMachine">Delete</button>
          </div>
          
     </form>


    </div>
  </div>
</div>
</div>
`

});