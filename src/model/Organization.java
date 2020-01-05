/***********************************************************************
 * Module:  Organization.java
 * Author:  Gegic
 * Purpose: Defines the Class Organization
 ***********************************************************************/
package model;

import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Objects;

public class Organization {
   private String name;
   private String description;
   private String logoPath;

   
   transient private List<User> users;
   private List<VirtualMachine> machines = new ArrayList<>();
   private List<Drive> drives = new ArrayList<>();

   public Organization() {
   }

   public Organization(String name, String description, String logoPath) {
      this.name = name;
      this.description = description;
      this.logoPath = logoPath;
   }

   public List<User> getUsers() {
      if (users == null)
         users = new ArrayList<User>();
      return users;
   }
   
   public Iterator<User> getIteratorUsers() {
      if (users == null)
         users = new ArrayList<User>();
      return users.iterator();
   }

   public void setUsers(List<User> newUsers) {
      removeAllUsers();
      for (Iterator<User> iter = newUsers.iterator(); iter.hasNext();)
         addUsers((User)iter.next());
   }

   public void addUsers(User newUser) {
      if (newUser == null)
         return;
      if (this.users == null)
         this.users = new ArrayList<User>();
      if (!this.users.contains(newUser))
      {
         this.users.add(newUser);
         newUser.setOrganization(this);      
      }
   }

   @Override
   public String toString() {
      return "Organization{" +
              "name='" + name + '\'' +
              ", description='" + description + '\'' +
              ", logoPath='" + logoPath + '\'' +
              '}';
   }

   public void removeUsers(User oldUser) {
      if (oldUser == null)
         return;
      if (this.users != null)
         if (this.users.contains(oldUser))
         {
            this.users.remove(oldUser);
            oldUser.setOrganization((Organization)null);
         }
   }
   
   public void removeAllUsers() {
      if (users != null)
      {
         User oldUser;
         for (Iterator<User> iter = getIteratorUsers(); iter.hasNext();)
         {
            oldUser = (User)iter.next();
            iter.remove();
            oldUser.setOrganization((Organization)null);
         }
      }
   }

   @Override
   public boolean equals(Object o) {
      if (this == o) return true;
      if (o == null || getClass() != o.getClass()) return false;
      Organization that = (Organization) o;
      return Objects.equals(name, that.name);
   }

   public void setName(String name) {
      this.name = name;
   }

   public void setDescription(String description) {
      this.description = description;
   }

   public void setLogoPath(String logoPath) {
      this.logoPath = logoPath;
   }

   public String getLogoPath() {
      return logoPath;
   }

   public String getName() {
      return name;
   }

   @Override
   public int hashCode() {
      return Objects.hash(name);
   }

   public void addMachine(VirtualMachine machine){
      machines.add(machine);
   }

   public List<VirtualMachine> getMachines(){
      return machines;
   }

   public boolean removeMachine(VirtualMachine removed){
      if(removed == null)
         return false;
      machines.remove(removed);
      return true;
   }

   public List<Drive> getDrives(){
      return drives;
   }

   public boolean removeDrive(Drive removed){
      if(removed == null)
         return false;
      drives.remove(removed);
      return true;
   }

   public void addDrive(Drive drive){
      drives.add(drive);
   }

}