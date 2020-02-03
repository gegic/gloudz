import Vue from "../js/vue-em.js"

Vue.component("monthly-bill", {
    data: function () {
        return {
            showModal: false,
            error: null,
            monthlyBill: {
                startingDate: null,
                endingDate: null,
                organization: this.organization
            },
            containers: null,
        }
    },

    props: ['organization'],
    template: `

<div>
<button v-on:click="showModal = true" class="btn btn-secondary shadow btn-lg third-button">MONTHLY BILL</button>
<div v-if="showModal" v-on:click="showModal = false" class="unfocused"></div>
<div v-if="showModal" class="mymodal shadow" tabindex="-1">
  <div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Monthly bill for {{organization.name}}</h5>
        <button type="button" class="close" aria-label="Close" v-on:click="showModal = false">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body activities">
      
            <form @submit="setDates" method="post">
                <table>
                    <tr>
                        <td><input type="date" class="form-control" v-model="monthlyBill.startingDate" :max="monthlyBill.endingDate < currentDate ? monthlyBill.endingDate : currentDate"></td>
                        <td><input type="date" class="form-control" v-model="monthlyBill.endingDate" :min="monthlyBill.startingDate" :max="currentDate"></td>
                        <td><input type="submit" value="Submit"></td>
                    </tr>
                </table>
            </form>
            
            <table class="table table-bordered p-0" v-if="containers && containers.length > 0">
                 <tbody class="w-100 m-auto" v-for="container in containers">
                    <tr><td colspan="3">
                        <table class="table w-100" v-if="container.activities && container.activities.length > 0">
                            <tr><th colspan="5">Activities</th></tr>
                            <tr> <th scope="col">Starting date</th>
                              <th scope="col">Starting time</th>
            
                              <th scope="col">Ending date</th>
                              <th scope="col">Ending time</th>
                              <th scope="col">Price</th></tr>
                                <tr v-for="activity in container.activities">
                                <td><input type="date" class="form-control" :value="getDate(activity.resource.startingDate)" disabled></td>
                                <td><input type="number" class="form-control" v-bind:value="getTime(activity.resource.startingDate)" disabled></td>
            
                                <td><input type="date" class="form-control" :value="getDate(activity.resource.endingDate)" disabled></td>
                                <td><input type="number" class="form-control" v-bind:value="getTime(activity.resource.endingDate)" disabled></td>
                                <td>{{activity.price | round}}</td>
                            </tr>
                        </table>
                    </td></tr>
                    <tr><td colspan="3">
                        <table class="table w-100" v-if="container.drives && container.drives.length > 0">
                            <tr><th colspan="4">Drives</th></tr>
                            <tr> <th scope="col">Drive name</th>
                              <th scope="col">Drive capacity</th>

                              <th scope="col">Drive type</th>
                              <th scope="col">Price</th>
                                <tr v-for="drive in container.drives">
                                <td>{{drive.resource.name}}</td>
                                <td>{{drive.resource.capacity}}</td>
            
                                <td>{{drive.resource.type}}</td>
                                <td>{{drive.price | round}}</td>
                                        
                            </tr>
                        </table>
                    </td></tr>
                    <tr v-if="container.machine.price > 0">
                        <th>Machine name</th>
                        <th>Machine category</th>
                        <th>Machine total price</th>
                    </tr>
                    <tr>
                        <th>{{container.machine.resource.name}}</th>
                        <th>{{container.machine.resource.category.name}}</th>
                        <th>{{container.machine.price | round}}</th>
                    </tr>
                 </tbody>
                 
            </table> 
            
            <p v-else>Monthly bill period not selected</p>
              
          </div>
          <div class="modal-footer">
            <p class="lead">Total price: {{totalPrice | round}}</p>
            <button type="button" class="btn btn-secondary" v-on:click="showModal = false">Close</button>
          </div>

    </div>
  </div>
</div>
</div>
`,


filters: {
  round: function (value) {
    return value.toFixed(2);
  }
},
    computed: {
        currentDate: function () {
            let d = new Date(),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        },
        totalPrice: function() {
            let price = 0;
            if(!this.containers) return price;
            for(let container of this.containers){
                price += container.machine.price;
            }
            return price;
        }

    },
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
        getDate: function(formattedDate){
            if(!formattedDate) return null;
            return formattedDate.split("T")[0];
        },
        getTime: function(formattedDate){
            if(!formattedDate) return null;
            return formattedDate.split("T")[1];
        },
        resetForm: function(){
            this.containers = null;
            this.monthlyBill = {
                startingDate: null,
                endingDate: null,
                organization: this.organization
            };
        },
        setDates: function (event) {
            event.preventDefault();
            axios.post("/rest/monthlybill", this.monthlyBill).then(e => {
                this.containers = e.data;
                this.$forceUpdate();
            });
        }
    },
    created() {

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