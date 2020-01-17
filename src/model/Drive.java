/***********************************************************************
 * Module:  Drive.java
 * Author:  Gegic
 * Purpose: Defines the Class Drive
 ***********************************************************************/
package model;

public class Drive {
   private String name;
   private int capacity;
   private DriveType type;
   
   transient public VirtualMachine virtualMachine;
   
   
   public VirtualMachine getVirtualMachine() {
      return virtualMachine;
   }

   public String getName() {
      return name;
   }

   public int getCapacity() {
      return capacity;
   }

   public DriveType getType() {
      return type;
   }

   public void setName(String name) {
      this.name = name;
   }

   public void setCapacity(int capacity) {
      this.capacity = capacity;
   }

   public void setType(DriveType type) {
      this.type = type;
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
            oldVirtualMachine.removeDrive(this);
         }
         if (newVirtualMachine != null)
         {
            this.virtualMachine = newVirtualMachine;
            this.virtualMachine.addDrive(this);
         }
      }
   }

   public Drive(String name, int capacity, DriveType type) {
      this.name = name;
      this.capacity = capacity;
      this.type = type;
   }

   public void setProperties(Drive newDrive){
      this.name = newDrive.getName();
      this.capacity = newDrive.getCapacity();
      this.type = newDrive.getType();
      this.setVirtualMachine(newDrive.getVirtualMachine());
   }
   public void setOVM(VirtualMachine vm){
      this.virtualMachine = vm;
   }

}