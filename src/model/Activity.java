/***********************************************************************
 * Module:  Activity.java
 * Author:  Gegic
 * Purpose: Defines the Class Activity
 ***********************************************************************/
package model;

import java.time.LocalDateTime;

public class Activity {
   private LocalDateTime startingDate;
   private LocalDateTime endingDate;
   
   transient public VirtualMachine virtualMachine;

   public LocalDateTime getStartingDate() {
      return startingDate;
   }

   public LocalDateTime getEndingDate() {
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

   public Activity(LocalDateTime startingDate, LocalDateTime endingDate) {
      this.startingDate = startingDate;
      this.endingDate = endingDate;
   }

   public Activity(LocalDateTime startingDate) {
      this.startingDate = startingDate;
      this.endingDate = null;
   }

   public void setOVM(VirtualMachine vm){
      this.virtualMachine = vm;
   }
}