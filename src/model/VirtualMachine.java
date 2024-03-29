/***********************************************************************
 * Module:  VirtualMachine.java
 * Author:  Gegic
 * Purpose: Defines the Class VirtualMachine
 ***********************************************************************/
package model;

import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;

public class VirtualMachine {
   private String name;
   private VMCategory category;
   private List<Drive> drives = new ArrayList<>();
   private List<Activity> activities = new ArrayList<>();
   private Activity ongoingActivity;

   public Activity getOngoingActivity() {
      return ongoingActivity;
   }

   public void setOngoingActivity(Activity ongoingActivity) {
      this.ongoingActivity = ongoingActivity;
   }

   public VirtualMachine(String name, VMCategory category) {
      this.name = name;
      this.category = category;
   }

   public String getName() {
      return name;
   }

   public void setCategory(VMCategory category) {
      this.category = category;
   }

   public VirtualMachine(String name) {
      this.name = name;
   }

   public List<Drive> getDrives() {
      if (drives == null)
         drives = new ArrayList<Drive>();
      return drives;
   }

   public VMCategory getCategory() {
      return category;
   }

   public Iterator<Drive> getIteratorDrive() {
      if (drives == null)
         drives = new ArrayList<Drive>();
      return drives.iterator();
   }

   public void setDrives(List<Drive> newDrive) {
      removeAllDrive();
      for (Drive d : drives) {
         drives.add(d);
         d.setOVM(this);
      }
   }

   public void addDrive(Drive newDrive) {
      if (newDrive == null)
         return;
      if (this.drives == null)
         this.drives = new ArrayList<Drive>();
      if (!this.drives.contains(newDrive))
      {
         this.drives.add(newDrive);
         newDrive.setVirtualMachine(this);      
      }
   }

   public void removeDrive(Drive oldDrive) {
      if (oldDrive == null)
         return;
      if (this.drives != null)
         if (this.drives.contains(oldDrive))
         {
            this.drives.remove(oldDrive);
            oldDrive.setVirtualMachine((VirtualMachine)null);
         }
   }
   
   public void removeAllDrive() {
      if (drives != null)
      {
         for (Drive d : drives)
         {
            d.nullVM();
         }
         drives.clear();
      } else{
         drives = new ArrayList<>();
      }
   }

   public void setProperties(VirtualMachine newVM){
      this.name = newVM.getName();
      this.category = newVM.getCategory();
      this.setActivities(newVM.getActivities());
      this.setDrives(newVM.getDrives());
      this.ongoingActivity = newVM.getOngoingActivity();
   }

   public Iterator<Activity> getIteratorActivity() {
      if (activities == null)
         activities = new ArrayList<Activity>();
      return activities.iterator();
   }

   public void setActivities(List<Activity> newActivity) {
      removeAllActivity();
      for (Activity a : newActivity) {
         activities.add(a);
         a.setOVM(this);
      }
   }

   public void addActivity(Activity newActivity) {
      if (newActivity == null)
         return;
      if (this.activities == null)
         this.activities = new ArrayList<Activity>();
      if (!this.activities.contains(newActivity))
      {
         this.activities.add(newActivity);
         newActivity.setVirtualMachine(this);
      }
   }

   public void removeActivity(Activity oldActivity) {
      if (oldActivity == null)
         return;
      if (this.activities != null)
         if (this.activities.contains(oldActivity))
         {
            this.activities.remove(oldActivity);
            oldActivity.setVirtualMachine((VirtualMachine)null);
         }
   }

   public void removeAllActivity() {
      if (activities != null)
      {
         Activity oldActivity;
         for (Activity a : activities)
         {
            a.nullVM();
         }
         activities.clear();

      }
   }
   public List<Activity> getActivities() {
      if (activities == null)
         activities = new ArrayList<Activity>();
      return activities;
   }

}