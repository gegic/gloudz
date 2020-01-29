/***********************************************************************
 * Module:  Application.java
 * Author:  Gegic
 * Purpose: Defines the Class Application
 ***********************************************************************/
package model;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.google.gson.stream.JsonWriter;
import com.sun.org.apache.xpath.internal.operations.Or;

import java.io.*;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;

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

   public boolean hasUser(String email){
      return getUser(email) != null;
   }

   public boolean hasUserExcept(String email, String except){
      for(User u : users){
         if(!u.getEmail().equalsIgnoreCase(except) && u.getEmail().equalsIgnoreCase(email)){
            return true;
         }
      }
      return false;
   }

   public User getUser(String email){
      for(User u : users){
         if(u.getEmail().equalsIgnoreCase(email)){
            return u;
         }
      }
      return null;
   }
   public boolean setUser(String email, User newUser){
      for(User u : users){
         if(u.getEmail().equalsIgnoreCase(email)){
            u.setProperties(newUser);
            return true;
         }
      }
      return false;
   }

   public boolean removeUser(String email){
      User removed = getUser(email);
      if(removed == null)
         return false;
      removed.setOrganization(null);

      users.remove(removed);
      return true;
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

   public boolean hasMachine(String name){
      return getMachine(name) != null;
   }

   public VirtualMachine getMachine(String name){
      for(VirtualMachine m : machines){
         if(m.getName().equalsIgnoreCase(name)){
            return m;
         }
      }
      return null;
   }

   public void addMachine(VirtualMachine machine, Organization org){

      if (machine == null)
         return;
      if (this.machines == null)
         this.machines = new ArrayList<>();
      if (!this.machines.contains(machine)) {
         Organization found = getOrganizationName(org.getName());
         this.machines.add(machine);
         found.addMachine(machine);
      }
   }

   public boolean hasMachineExcept(String name, String except){
      for(VirtualMachine m : machines){
         if(!m.getName().equalsIgnoreCase(except) && m.getName().equalsIgnoreCase(name)){
            return true;
         }
      }
      return false;
   }

   public boolean setMachine(String name, VirtualMachine newMachine){
      VirtualMachine old = getMachine(name);
      if(old == null)
         return false;
      old.setProperties(newMachine);
      return true;
   }

   public List<Drive> getDrives() {
      return drives;
   }

   public boolean removeMachine(String name, String orgName){
      VirtualMachine removed = getMachine(name);
      if(removed == null)
         return false;
      removed.removeAllDrive();
      removed.removeAllActivity();
      machines.remove(removed);
      Organization org = getOrganizationName(orgName);
      org.removeMachine(removed);
      return true;
   }

   public boolean hasDrive(String name){
      return getDrive(name) != null;
   }

   public Drive getDrive(String name){
      for(Drive m : drives){
         if(m.getName().equalsIgnoreCase(name)){
            return m;
         }
      }
      return null;
   }

   public void addDrive(Drive drive, VirtualMachine machine, Organization org){

      if (drive == null)
         return;
      if (this.drives == null)
         this.drives = new ArrayList<>();
      if (!this.drives.contains(drive)) {
         VirtualMachine vm = null;
         if(machine != null)
            vm = getMachine(machine.getName());
         this.drives.add(drive);
         Organization found = getOrganizationName(org.getName());
         found.addDrive(drive);
         if(vm != null)
            vm.addDrive(drive);
      }
   }

   public boolean hasDriveExcept(String name, String except){
      for(Drive m : drives){
         if(!m.getName().equalsIgnoreCase(except) && m.getName().equalsIgnoreCase(name)){
            return true;
         }
      }
      return false;
   }

   public boolean setDrive(String name, Drive newDrive, VirtualMachine machine){
      Drive old = getDrive(name);
      VirtualMachine vm = null;
      if(machine != null)
         vm = getMachine(machine.getName());
      if(old == null)
         return false;
      old.setProperties(newDrive);
      if(vm != null){
         vm.addDrive(old);
      }
      return true;
   }

   public boolean removeDrive(String name, String orgName){
      Drive removed = getDrive(name);
      if(removed == null)
         return false;
      removed.setVirtualMachine(null);

      drives.remove(removed);
      Organization org = getOrganizationName(orgName);
      org.removeDrive(removed);
      return true;
   }
   public void mockMachines(){
      VirtualMachine vm1 = new VirtualMachine("DSA", categories.get(0));
      VirtualMachine vm2 = new VirtualMachine("DSA dva", categories.get(0));
      organizations.get(0).addMachine(vm1);
      machines.add(vm1);
      vm1.addActivity(new Activity(LocalDateTime.parse("2019-11-01T10:15:30", DateTimeFormatter.ISO_LOCAL_DATE_TIME), LocalDateTime.parse("2020-01-02T11:15:30", DateTimeFormatter.ISO_LOCAL_DATE_TIME)));
      organizations.get(1).addMachine(vm2);
      machines.add(vm2);
      Drive d1 = new Drive("OurSSD", 50, DriveType.ssd);
      Drive d2 = new Drive("OurHDD", 120, DriveType.hdd);
      Drive d3 = new Drive("UltraSSD", 800, DriveType.ssd);
      drives.add(d1);
      drives.add(d2);
      drives.add(d3);
      organizations.get(0).addDrive(d1);
      vm1.addDrive(d1);
      organizations.get(0).addDrive(d2);
      organizations.get(1).addDrive(d3);
   }

   private void saveOrganizations(Gson g) throws IOException {
      Writer w = new FileWriter("frontend\\data\\json\\organizations.json");
      g.toJson(organizations, w);
      w.close();
   }
   private void saveMachines(Gson g) throws IOException {
      Writer w =  new FileWriter("frontend\\data\\json\\machines.json");
      g.toJson(machines, w);
      w.close();
   }
   private void saveDrives(Gson g) throws IOException {
      Writer w =  new FileWriter("frontend\\data\\json\\drives.json");
      g.toJson(drives, w);
      w.close();
   }
   private void saveCategories(Gson g) throws IOException {
      Writer w =  new FileWriter("frontend\\data\\json\\categories.json");
      g.toJson(categories, w);
      w.close();
   }
   private void saveUsers(Gson g) throws IOException {
      Writer w =  new FileWriter("frontend\\data\\json\\users.json");
      g.toJson(users, w);
      w.close();
   }

   public void saveAll(Gson g){
      try {
         saveOrganizations(g);
         saveMachines(g);
         saveDrives(g);
         saveCategories(g);
         saveUsers(g);
      } catch(IOException e){
         e.printStackTrace();
      }
   }

   public void loadAll(Gson g){
      try {
         loadCategories(g);
         loadDrives(g);
         loadMachines(g);

         loadOrganizations(g);
         loadUsers(g);

      } catch (FileNotFoundException e){
         e.printStackTrace();
      }
   }

   private void loadOrganizations(Gson g) throws FileNotFoundException {
      setOrganizations(g.fromJson(new FileReader(
              new File("frontend/data/json/organizations.json")),
              new TypeToken<ArrayList<Organization>>(){}.getType()));
   }
   private void loadMachines(Gson g) throws FileNotFoundException {
      machines = g.fromJson(new FileReader(
              new File("frontend/data/json/machines.json")),
              new TypeToken<ArrayList<VirtualMachine>>(){}.getType());
   }
   private void loadCategories(Gson g) throws FileNotFoundException {
      categories = g.fromJson(new FileReader(
                      new File("frontend/data/json/categories.json")),
              new TypeToken<ArrayList<VMCategory>>(){}.getType());
   }
   private void loadDrives(Gson g) throws FileNotFoundException {
      drives = g.fromJson(new FileReader(
              new File("frontend/data/json/drives.json")),
              new TypeToken<ArrayList<Drive>>(){}.getType());
   }
   private void loadUsers(Gson g) throws FileNotFoundException {
      users = g.fromJson(new FileReader(
              new File("frontend/data/json/users.json")),
              new TypeToken<ArrayList<User>>(){}.getType());

      for(User u : users){
         if(u.getRole().equals(UserRole.superAdmin))
            return;
      }
      users.add(new User("a@a", "adminadmin", "Admin", "Admin", UserRole.superAdmin));
   }
}