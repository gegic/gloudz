/***********************************************************************
 * Module:  Application.java
 * Author:  Gegic
 * Purpose: Defines the Class Application
 ***********************************************************************/
package model;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class Application {
   private User currentUser;

   private List<User> users;
   private List<Organization> organizations;
   private List<VMCategory> categories;
   private List<VirtualMachine> machines;
   private List<Drive> drives = new ArrayList<>();

   private static Application instance;

   private Application() {
      users = new ArrayList<>();
      users.add(new User("a@a", "adminadmin", "Admin", "Admin", UserRole.superAdmin));
      organizations = new ArrayList<>();
      categories = new ArrayList<>();
      categories.add(new VMCategory("Cat1", 4, 16, 2));

      machines = new ArrayList<>();
   }

   public static Application getInstance() {
      if (instance == null)
         instance = new Application();
      return instance;
   }

   public List<User> getUsers() {
      if (users == null)
         users = new ArrayList<User>();
      return users;
   }

   public List<VMCategory> getCategories() {
      if (categories == null)
         categories = new ArrayList<>();
      return categories;
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
         this.users.add(newUser);
   }

   public void removeUsers(User oldUser) {
      if (oldUser == null)
         return;
      if (this.users != null)
         if (this.users.contains(oldUser)) {
            this.users.remove(oldUser);
            oldUser.setOrganization(null);
         }
   }

   public void removeAllUsers() {
      if (users != null)
         users.clear();
   }
   public List<Organization> getOrganizations() {
      if (organizations == null)
         organizations = new ArrayList<Organization>();
      return organizations;
   }
   public List<VirtualMachine> getMachines() {
      if (machines == null)
         machines = new ArrayList<>();
      return machines;
   }

   public User findUser(User u) {
      int i = users.indexOf(u);
      return i == -1 ? null : users.get(i);
   }

   public Iterator<Organization> getIteratorOrganizations() {
      if (organizations == null)
         organizations = new ArrayList<Organization>();
      return organizations.iterator();
   }

   public void setOrganizations(List<Organization> newOrganizations) {
      removeAllOrganizations();
      for (Iterator<Organization> iter = newOrganizations.iterator(); iter.hasNext();)
         addOrganizations((Organization)iter.next());
   }

   public boolean addOrganizations(Organization newOrganization) {
      if (newOrganization == null)
         return false;
      if (this.organizations == null)
         this.organizations = new ArrayList<Organization>();
      if (this.organizations.contains(newOrganization))
         return false;
      this.organizations.add(newOrganization);
      return true;
   }

   public void removeOrganizations(Organization oldOrganization) {
      if (oldOrganization == null)
         return;
      if (this.organizations != null)
         if (this.organizations.contains(oldOrganization)) {
            this.organizations.remove(oldOrganization);
            oldOrganization.removeAllUsers();
         }
   }

   public void removeAllOrganizations() {
      if (organizations != null)
         organizations.clear();
   }
   
      public boolean hasCategory(String name){
      return getCategory(name) != null;
   }

   public void addCategory(VMCategory cat) {
      if (cat == null)
         return;
      if (this.categories == null)
         this.categories = new ArrayList<>();
      if (!this.categories.contains(cat))
         this.categories.add(cat);
   }

   public VMCategory getCategory(String name){
      for(VMCategory c : categories){
         if(c.getName().equalsIgnoreCase(name))
            return c;
      }
      return null;
   }

   public boolean hasCategoryExcept(String name, String except){
      for(VMCategory c : categories){
         if(!c.getName().equalsIgnoreCase(except) && c.getName().equalsIgnoreCase(name)){
            return true;
         }
      }
      return false;
   }

   public boolean setCategory(String name, VMCategory other){
      VMCategory cat = getCategory(name);
      if(cat == null){
         return false;
      }
      cat.setProperties(other);
      return true;
   }
  

   public boolean removeCategory(String name){
      VMCategory cat = getCategory(name);
      if(cat == null) return false;
      for(VirtualMachine vm : machines){
         if(vm.getCategory().equals(cat))
            return false;
      }
      categories.remove(cat);
      return true;
   }
    
   public boolean hasOrg(String name){
      return getOrganizationName(name) != null;
   }

   public boolean hasOrgExcept(String name, String except){
      for(Organization o : organizations){
         if(!o.getName().equalsIgnoreCase(except) && o.getName().equalsIgnoreCase(name))
            return true;
      }
      return false;
   }

   public Organization getOrganizationName(String name){
      for(Organization o : organizations){
         if(o.getName().equalsIgnoreCase(name))
            return o;
      }
      return null;
   }

}