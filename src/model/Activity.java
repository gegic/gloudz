/***********************************************************************
 * Module:  Activity.java
 * Author:  Gegic
 * Purpose: Defines the Class Activity
 ***********************************************************************/
package model;

import java.time.LocalDate;

public class Activity {
   private LocalDate startingDate;
   private LocalDate endingDate;
   
   transient public VirtualMachine virtualMachine;

   public LocalDate getStartingDate() {
      return startingDate;
   }

   public LocalDate getEndingDate() {
      return endingDate;
   }

   public void nullVM(){
      if(this.virtualMachine != null){
         this.virtualMachine = null;
      }
   }

   public void setVirtualMachine(VirtualMachine newVirtualMachine) {
      if (this.virtualMachine == null || !this.virtualMachine.equals(newVirtualMachine))
      {
         if (this.virtualMachine != null)
         {
            VirtualMachine oldVirtualMachine = this.virtualMachine;
            this.virtualMachine = null;
            oldVirtualMachine.removeActivity(this);
         }
         if (newVirtualMachine != null)
         {
            this.virtualMachine = newVirtualMachine;
            this.virtualMachine.addActivity(this);
         }
      }
   }

   public Activity(LocalDate startingDate, LocalDate endingDate) {
      this.startingDate = startingDate;
      this.endingDate = endingDate;
   }

   public Activity(LocalDate startingDate) {
      this.startingDate = startingDate;
      this.endingDate = null;
   }
}