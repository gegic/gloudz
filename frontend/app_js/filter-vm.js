import Vue from "../js/vue-em.js"

Vue.component("filter-vm", {
    data: function () {
        return {
            showModal: false,
            error: null,
        }
    },
    computed:{
        maxForMinCores: function(){
            if(this.filterData.cores.max) return this.filterData.cores.max;
            else return 100;
        },
        minForMaxCores: function () {
            if(this.filterData.cores.min) return this.filterData.cores.min;
            else return 0;
        },
        maxForMinRam: function(){
            if(this.filterData.ram.max) return this.filterData.ram.max;
            else return 1000;
        },
        minForMaxRam: function () {
            if(this.filterData.ram.min) return this.filterData.ram.min;
            else return 0;
        },
        maxForMinGpuCores: function(){
            if(this.filterData.gpuCores.max) return this.filterData.gpuCores.max;
            else return 100;
        },
        minForMaxGpuCores: function () {
            if(this.filterData.gpuCores.min) return this.filterData.gpuCores.min;
            else return 0;
        },
    },

    props: ["filterData"],
    methods: {
        checkAndSend: function (event) {
            event.preventDefault();
            this.$emit('filtered', this.filterData);
            this.showModal = false;
        }
    },
    template: `

<div v-if="filterData">
<button type="button" v-on:click="showModal = true" class="btn btn-secondary filter-button">FILTER</button>
<div v-if="showModal" v-on:click="showModal = false" class="unfocused"></div>
<div v-if="showModal" class="mymodal shadow" tabindex="-1">
  <div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Filters</h5>
        <button type="button" class="close" aria-label="Close" v-on:click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form id="add-form" ref="add" v-on:submit="checkAndSend" method="POST">

          <div class="modal-body">
          
            <table class="filter-elements">
            <tr>
            <td class="pr-3">
           
            <p class="lead">Filter by core interval</p>
            </td>
            <td class="mr-3">
            <div class="form-label-group">
                <input type="number" id="coresMin" class="form-control" min="0" :max="maxForMinCores" placeholder="Minimum cores" v-model="filterData.cores.min" required>
                <label for="coresMin">Minimum cores</label>
                
            </div> 
            </td>
            
            <td class="mr-3">

            
            <div class="form-label-group">
                <input type="number" id="coresMax" class="form-control" :min="minForMaxCores" max="100" placeholder="Maximum cores" v-model="filterData.cores.max" required>
                <label for="coresMax">Maximum cores</label>
            </div>
            
            </td>
            </tr>
            <tr>
            <td class="pr-3">
            
            <p class="lead">Filter by RAM interval</p>
            </td>
            <td class="mr-3">

            <div class="form-label-group">
                <input type="number" id="ramMin" class="form-control" min="0" :max="maxForMinRam" placeholder="Minimum RAM" v-model="filterData.ram.min" required>
                <label for="ramMin">Minimum RAM</label>
                
            </div>
            </td>
            <td class="mr-3">
            <div class="form-label-group">
                <input type="number" id="ramMax" class="form-control" :min="minForMaxRam" max="1000" placeholder="Maximum RAM" v-model="filterData.ram.max" required>
                <label for="ramMax">Maximum RAM</label>
            </div>
            </td>
            </tr>
            <tr>
            <td class="mr-3">

            <p class="lead">Filter by GPU cores interval</p>
            </td>
            <td class="mr-3">

            <div class="form-label-group">
                <input type="number" id="gpuMin" class="form-control" min="0" :max="maxForMinGpuCores" placeholder="Minimum GPU cores" v-model="filterData.gpuCores.min" required>
                <label for="gpuMin">Minimum GPU cores</label>
                
            </div> 
            </td>
            <td class="mr-3">

            <div class="form-label-group">
                <input type="number" id="gpuMax" class="form-control" :min="minForMaxGpuCores" max="100" placeholder="Maximum GPU cores" v-model="filterData.gpuCores.max" required>
                <label for="gpuMax">Maximum GPU cores</label>
            </div>
            </td>
            </tr>
            </table>
           
              
              <div v-if="error != null" class="alert alert-warning" role="alert">
                {{error}}
              </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" v-on:click="showModal = false">Close</button>
            <button type="submit" class="btn btn-primary">SUBMIT</button>
          </div>
          
     </form>


    </div>
  </div>
</div>
</div>
`,
    watch: {
        showModal: function () {
            if (this.showModal) {
                document.documentElement.style.overflow = 'hidden';
                return;
            }

            document.documentElement.style.overflow = 'auto';

        }
    }

});