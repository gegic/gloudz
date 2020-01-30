package deserializers;

import cloud.App;
import com.google.gson.*;
import model.*;

import java.lang.reflect.Type;
import java.time.LocalDate;

public class OrganizationDeserializer implements JsonDeserializer<Organization> {

    @Override
    public Organization deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        JsonObject jsonObject = jsonElement.getAsJsonObject();

        Organization added = new Organization(
                jsonObject.get("name").getAsString(),
                jsonObject.get("description").getAsString(),
                jsonObject.get("logoPath").getAsString());

        if(jsonObject.has("machines")){
            JsonArray machineArray = jsonObject.get("machines").getAsJsonArray();
            for(JsonElement je : machineArray){
                JsonObject jobj = je.getAsJsonObject();
                VirtualMachine found = Application.getInstance().getMachine(jobj.get("name").getAsString());
                added.addMachine(found);
            }
        }

        if(jsonObject.has("drives")){
            JsonArray driveArray = jsonObject.get("drives").getAsJsonArray();
            for(JsonElement je : driveArray){
                JsonObject jobj = je.getAsJsonObject();
                Drive found = Application.getInstance().getDrive(jobj.get("name").getAsString());
                added.addDrive(found);
            }
        }

        return added;
    }
}
