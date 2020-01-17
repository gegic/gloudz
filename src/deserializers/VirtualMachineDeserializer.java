package deserializers;

import com.google.gson.*;
import model.*;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.List;

public class VirtualMachineDeserializer implements JsonDeserializer<VirtualMachine> {

    @Override
    public VirtualMachine deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        JsonObject jsonObject = jsonElement.getAsJsonObject();
        VirtualMachine added = new VirtualMachine(
                jsonObject.get("name").getAsString()
        );

        if(jsonObject.has("category")) {
            VMCategory cat = Application.getInstance().getCategory(jsonObject.get("category").getAsJsonObject().get("name").getAsString());
            added.setCategory(cat);
        }
        if(jsonObject.has("ongoingActivity")) {
            JsonObject jOactivity = jsonObject.get("ongoingActivity").getAsJsonObject();
            Activity ac = new Activity(LocalDate.parse(jOactivity.get("startingDate").getAsString()));
            added.setOngoingActivity(ac);
        }

        if(jsonObject.has("activities")){
            JsonArray activityArray = jsonObject.get("activities").getAsJsonArray();
            for(JsonElement je : activityArray){
                JsonObject jobj = je.getAsJsonObject();
                Activity ac = new Activity(
                        LocalDate.parse(jobj.get("startingDate").getAsString()),
                        LocalDate.parse(jobj.get("endingDate").getAsString()));
                added.addActivity(ac);
            }
        }

        if(jsonObject.has("drives")){
            JsonArray driveArray = jsonObject.get("drives").getAsJsonArray();
            for(JsonElement je : driveArray){
                System.out.println(je.toString());

                JsonObject jobj = je.getAsJsonObject();
                Drive d = new Drive(jobj.get("name").getAsString(),
                        jobj.get("capacity").getAsInt(),
                        DriveType.valueOf(jobj.get("type").getAsString()));

                added.addDrive(d);
            }
        }

        for (Activity activity : added.getActivities()) {
            System.out.println(activity.getStartingDate());
            System.out.println(activity.getEndingDate());
        }
        return added;
    }
}
