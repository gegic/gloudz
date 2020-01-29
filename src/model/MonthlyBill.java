package model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class MonthlyBill {

    private LocalDate startingDate;
    private LocalDate endingDate;
    private Organization organization;

    private class BillWrapper<T>{
        private T resource;
        private double price;
        private double perHour;

        public BillWrapper(T resource, double price) {
            this.resource = resource;
            this.price = price;
            this.perHour = 0;
        }

        public BillWrapper(T resource, double price, double perHour) {
            this(resource, price);
            this.perHour = perHour;
        }

        public void addPrice(double price){
            this.price += price;
        }

        public double getPerHour() {
            return perHour;
        }
    }

    private class Container{
        private BillWrapper<VirtualMachine> machine;
        private List<BillWrapper<Activity>> activities = new ArrayList<>();
        private List<BillWrapper<Drive>> drives = new ArrayList<>();
        public Container(VirtualMachine machine) {
            this.machine = new BillWrapper<>(machine, 0, pph(machine));
        }


        public void addActivity(LocalDateTime start, LocalDateTime end){
            double hours = ChronoUnit.HOURS.between(start, end) + 1;
            double ran = machine.getPerHour() * hours;
            BillWrapper<Activity> activityBill = new BillWrapper<>(new Activity(start, end), ran);
            activities.add(activityBill);
            machine.addPrice(ran);
        }

        public void addDrive(Drive drive, LocalDateTime start, LocalDateTime end){
            double hours = ChronoUnit.HOURS.between(start, end);
            double pph = (drive.getType().equals(DriveType.hdd) ? 0.1 : 0.3) / (30 * 24);
            double ran = hours * pph;
            BillWrapper<Drive> driveBill = new BillWrapper<>(drive, ran, pph);
            drives.add(driveBill);
            machine.addPrice(ran);
        }

        private double pph(VirtualMachine vm){
            return (25 * vm.getCategory().getCores() + 15* vm.getCategory().getRam() + vm.getCategory().getGpuCores()) / (30.0 * 24);
    }


    }

    public List<Container> bill(){
        List<Container> bill = new ArrayList<>();
        for(VirtualMachine machine : organization.getMachines()){
            Container c = new Container(machine);
            for(Activity activity : machine.getActivities()) {
                if (startingDate.isAfter(activity.getEndingDate().toLocalDate())
                        || endingDate.isBefore(activity.getStartingDate().toLocalDate())) {
                    continue;
                }
                LocalDateTime leftBoundary = startingDate.isBefore(activity.getStartingDate().toLocalDate()) ?
                        activity.getStartingDate() : startingDate.atStartOfDay();
                LocalDateTime rightBoundary = endingDate.isBefore(activity.getEndingDate().toLocalDate()) ?
                        endingDate.atStartOfDay() : activity.getEndingDate();

                c.addActivity(leftBoundary, rightBoundary);
            }
            for(Drive drive : machine.getDrives()){
                c.addDrive(drive, startingDate.atStartOfDay(), endingDate.atStartOfDay());
            }
            if(machine.getOngoingActivity() != null) {
                if(!endingDate.isBefore(machine.getOngoingActivity().getStartingDate().toLocalDate())){
                    LocalDateTime leftBoundary = startingDate.isBefore(machine.getOngoingActivity().getStartingDate().toLocalDate()) ?
                            machine.getOngoingActivity().getStartingDate() : startingDate.atStartOfDay();
                    LocalDateTime rightBoundary = endingDate.isBefore(LocalDate.now()) ?
                            endingDate.atStartOfDay() : LocalDateTime.now();
                    c.addActivity(leftBoundary, rightBoundary);
                }
            }
            bill.add(c);
        }
        return bill;
    }


}
