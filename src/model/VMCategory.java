/***********************************************************************
 * Module:  VMCategory.java
 * Author:  Gegic
 * Purpose: Defines the Class VMCategory
 ***********************************************************************/

package model;

import java.util.Objects;

/** @pdOid e50547bd-957a-42e0-8f42-62cb331e95d5 */
public class VMCategory {
   /** @pdOid 191910b5-ff3e-41dd-b357-b6449f7daede */
   private String name;

   public String getName() {
      return name;
   }

   /** @pdOid cd2c3c13-eae3-40d1-90e0-d8d2b26a28bd */
   private int cores;
   /** @pdOid e8bea5d2-feae-467f-9ed5-78e732427fc2 */
   private int ram;
   /** @pdOid 57036813-acf7-4241-92ce-a895579a303f */
   private int gpuCores;

   public VMCategory(String name, int cores, int ram, int gpuCores) {
      this.name = name;
      this.cores = cores;
      this.ram = ram;
      this.gpuCores = gpuCores;
   }

   public int getCores() {
      return cores;
   }

   public int getRam() {
      return ram;
   }

   public int getGpuCores() {
      return gpuCores;
   }

   public void setProperties(VMCategory other){
      this.name = other.getName();
      this.cores = other.getCores();
      this.ram = other.getRam();
      this.gpuCores = other.getGpuCores();
   }

   @Override
   public boolean equals(Object o) {
      if (this == o) return true;
      if (o == null || getClass() != o.getClass()) return false;
      VMCategory that = (VMCategory) o;
      return Objects.equals(name, that.name);
   }

   @Override
   public int hashCode() {
      return Objects.hash(name);
   }
}