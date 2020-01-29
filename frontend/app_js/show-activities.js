import Vue from "../js/vue-em.js"

Vue.component("show-activities", {
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

    props: ["preVM", 'organization', 'activeUser'],
    template: `

<div>
<button v-on:click="showModal = true" class="btn btn-secondary shadow btn-lg third-button">ACTIVITIES</button>
<div v-if="showModal" v-on:click="showModal = false" class="unfocused"></div>
<div v-if="showModal" class="mymodal shadow" tabindex="-1">
  <div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Activities for {{vm.name}}</h5>
        <button type="button" class="close" aria-label="Close" v-on:click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body activities">
            
            <table v-if="(vm.activities && vm.activities.length > 0) || vm.ongoingActivity" class="table">
              <thead>
                <tr>
                  <th scope="col">Starting date</th>
                  <th scope="col">Starting time</th>

                  <th scope="col">Ending date</th>
                  <th scope="col">Ending time</th>

                  <th scope="col">Remove</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="activity in vm.activities">
                  <td><input type="date" class="form-control" @change="setStartingDate($event, activity)" v-bind:value="getDate(activity.startingDate)" :max="getDate(activity.endingDate)"></td>
                  <td><input type="number" class="form-control" @change="setStartingTime($event, activity)" v-bind:value="getTime(activity.startingDate)" min="0" max="23" :disabled="!activity.startingDate"></td>
                  <td><input type="date" class="form-control" @change="setEndingDate($event, activity)" v-bind:value="getDate(activity.endingDate)" :min="getDate(activity.startingDate)" :disabled="!activity.startingDate"></td>
                  <td><input type="number" class="form-control" @change="setEndingTime($event, activity)" v-bind:value="getTime(activity.endingDate)" min="0" max="23" :disabled="!activity.endingDate"></td>

                  <td><button type="button" class="btn btn-danger" @click="remove(activity)">Remove</button> </td>
                </tr>
                
                <tr v-if="vm.ongoingActivity">
                    <td><input type="date" class="form-control" :value="getDate(vm.ongoingActivity.startingDate)" disabled></td>
                    <td><input type="number" class="form-control" v-bind:value="getTime(vm.ongoingActivity.startingDate)" disabled></td>

                    <td><input type="date" class="form-control" disabled></td>
                    <td><input type="number" class="form-control" v-bind:value="getTime(vm.ongoingActivity.endingDate)" disabled></td>

                    <td class="alert-danger">Ongoing</td>
                </tr>
                
              </tbody>
            </table> 
            
            <p v-else class="lead m-3">There are no activities associated with this virtual machine.</p>
              
              
          </div>
          <div v-if="error != null" class="alert alert-warning" role="alert">
            {{error}}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" v-on:click="showModal = false">Close</button>
            <button v-if="activeUser && activeUser.role === 'superAdmin'" type="button" class="btn btn-primary" @click="addEmptyActivity">Add an empty activity</button>
            <button v-if="activeUser && activeUser.role === 'superAdmin'" type="button" class="btn btn-primary" @click="checkAndSend">Submit</button>
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
        setStartingDate: function(event, activity){

            let time = "00";
            if(activity.startingDate) {
                time = activity.startingDate.split("T")[1];
            }
            activity.startingDate = event.target.value + "T" + time;
            this.$forceUpdate();
        },
        setStartingTime: function(event, activity){
            if(event.target.value < 0 || event.target.value > 23){
                alert("Mora da bude u opsegu 0 do 23");
                event.preventDefault();
            }
            let date = activity.startingDate.split("T")[0];
            let time = event.target.value;
            if(time < 10){
                time = "0" + time;
            }
            activity.startingDate = date + "T" + time;
            this.$forceUpdate();
        },
        getDate: function(formattedDate){
            if(!formattedDate) return null;
            return formattedDate.split("T")[0];
        },
        getTime: function(formattedDate){
            if(!formattedDate) return null;
            return formattedDate.split("T")[1];
        },
        setEndingDate: function(event, activity){
            let time = "00";
            if(activity.endingDate)
                time = activity.endingDate.split("T")[1];
            activity.endingDate = event.target.value + "T" + time;
            this.$forceUpdate();
        },
        setEndingTime: function(event, activity){
            if(event.target.value < 0 || event.target.value > 23){
                alert("Mora da bude u opsegu 0 do 23");
                event.preventDefault();
            }
            let date = activity.endingDate.split("T")[0];
            let time = event.target.value;
            if(time < 10){
                time = "0" + time;
            }
            activity.endingDate = date + "T" + time;
            this.$forceUpdate();
        },

        checkAndSend: function (event) {
            event.preventDefault();
            this.error = null;

            for(let activity of this.vm.activities){
                if(activity.startingDate == null){
                    this.error = "Please type in all starting dates.";
                    return;
                }
                if(activity.endingDate == null){
                    this.error = "Pleast type in all ending dates.";
                    return;
                }
                let startDate = activity.startingDate.split("T")[0];
                let startTime = activity.startingDate.split("T")[1];
                let endDate = activity.endingDate.split("T")[0];
                let endTime = activity.endingDate.split("T")[1];
                if(startDate === endDate && startTime > endTime){
                    this.error = "Start must be before ending";
                    return;
                }
            }
            this.submit(event);
        },
        submit: function (event) {
            axios.post("/rest/vm/" + this.organization.name + '/' + this.preVM.name, this.vm)
                .then(res => {
                    this.$router.push('/vm/' + res.data.location).then(e =>{
                        this.resetForm();
                        this.$emit("edit");
                        this.showModal = false;
                    }).catch(e => {
                        this.resetForm();
                        this.$emit("edit");
                        this.showModal = false;
                    });

                })
                .catch(res => {
                    this.error = "Server error occurred";
                });
        },
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
        addEmptyActivity: function () {
            this.vm.activities.push({startingDate: null, endingDate: null});
            this.$forceUpdate();
        },
        remove: function(activity){
            let newArray = this.vm.activities.filter(el => el !== activity);
            this.vm.activities = JSON.parse(JSON.stringify(newArray));
            this.$forceUpdate();
        }
    },
    created() {
        if(!this.vm.activities)
            this.vm.activities = [];
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