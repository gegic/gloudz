package deserializers;

import com.google.gson.*;
import model.*;

import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class VirtualMachineDeserializer implements JsonDeserializer<VirtualMachine> {

    @Override
    public VirtualMachine deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
    	
    	JsonObject jsonObject = jsonElement.getAsJsonObject();
    	if (jsonObject.isJsonNull() || jsonObject.entrySet().size() == 0) return null;
        VirtualMachine added = new VirtualMachine(
                jsonObject.get("name").getAsString()
        );

        if(jsonObject.has("category")) {
            VMCategory cat = Application.getInstance().getCategory(jsonObject.get("category").getAsJsonObject().get("name").getAsString());
            added.setCategory(cat);
        }
        if(jsonObject.has("ongoingActivity")) {
            JsonObject jOactivity = jsonObject.get("ongoingActivity").getAsJsonObject();
            Activity ac = new Activity(LocalDateTime.parse(jOactivity.get("startingDate").getAsString(), DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH")));
            added.setOngoingActivity(ac);
        }

        if(jsonObject.has("activities")){
            JsonArray activityArray = jsonObject.get("activities").getAsJsonArray();
            for(JsonElement je : activityArray){
                JsonObject jobj = je.getAsJsonObject();
                Activity ac = new Activity(
                        LocalDateTime.parse(jobj.get("startingDate").getAsString(), DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH")),
                        LocalDateTime.parse(jobj.get("endingDate").getAsString(), DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH")));
                added.addActivity(ac);
            }
        }

        if(jsonObject.has("drives")){
            JsonArray driveArray = jsonObject.get("drives").getAsJsonArray();
            for(JsonElement je : driveArray){

                JsonObject jobj = je.getAsJsonObject();
                Drive d = new Drive(jobj.get("name").getAsString(),
                        jobj.get("capacity").getAsInt(),
                        DriveType.valueOf(jobj.get("type").getAsString()));

                added.addDrive(d);
            }
        }

        return added;
    }
}
