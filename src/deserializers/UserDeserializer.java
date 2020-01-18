package deserializers;

import com.google.gson.*;
import model.Application;
import model.Organization;
import model.User;
import model.UserRole;

import java.lang.reflect.Type;

public class UserDeserializer  implements JsonDeserializer<User> {

    @Override
    public User deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
        JsonObject jsonObject = jsonElement.getAsJsonObject();
        User added = new User(jsonObject.get("email").getAsString(), jsonObject.get("password").getAsString());
        if(jsonObject.has("firstName"))
            added.setFirstName(jsonObject.get("firstName").getAsString());
        if(jsonObject.has("lastName"))
            added.setLastName(jsonObject.get("lastName").getAsString());
        if(jsonObject.has("role"))
            added.setRole(UserRole.valueOf(jsonObject.get("role").getAsString()));


        if(jsonObject.has("organization")) {
            Organization org = Application.getInstance().getOrganizationName(jsonObject.get("organization").getAsJsonObject().get("name").getAsString());
            added.setOrganization(org);
        }

        return added;
    }
}
