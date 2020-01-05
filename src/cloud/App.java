package cloud;
import static spark.Spark.externalStaticFileLocation;
import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;

import java.io.File;
import java.io.IOException;

import com.google.gson.Gson;

import model.Application;
import model.User;

public class App {

	private static Application application;
	private static Gson g;
	
	public static void main(String[] args) throws IOException {
		port(80);
		try {
			externalStaticFileLocation(new File("./frontend/").getCanonicalPath());
		} catch (IOException e) {
			e.printStackTrace();
		}

		application = Application.getInstance();
		
		g = new Gson();

		post("/rest/login", (req, res) ->{
			System.out.println(req.body());
			User u = g.fromJson(req.body(), User.class);
			User got = application.findUser(u);
			if(got == null){
				res.status(401);
			}
			req.session().attribute("logged", got);
			return g.toJson(got);
		});

		get("/rest/logged", (req, res) -> {
			User logged = req.session().attribute("logged");
			System.out.println(logged);
			return logged != null ? g.toJson(logged) : "";
		});

		get("/rest/logout", (req, res) -> {
			req.session().invalidate();
			return "";
		});

	}

}
