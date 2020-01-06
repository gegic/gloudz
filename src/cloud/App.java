package cloud;
import static spark.Spark.externalStaticFileLocation;
import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.delete;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Scanner;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

import com.google.gson.Gson;

import model.Application;
import model.Organization;
import model.User;
import model.VMCategory;
import spark.utils.IOUtils;

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
		
		get("/rest/categories", (req, res) -> g.toJson(application.getCategories()));
		
				post("/rest/category", (req, res) -> {
			VMCategory cat = g.fromJson(req.body(), VMCategory.class);
			if(application.hasCategory(cat.getName())){
				res.status(400);
				return "";
			}

			application.addCategory(cat);
			
			return "";
		});

		get("/rest/category/:name", (req, res) -> g.toJson(application.getCategory(req.params("name"))));

		post("/rest/category/:name", (req, res) -> {
			VMCategory edited = g.fromJson(req.body(), VMCategory.class);
			if(application.hasCategoryExcept(edited.getName(), req.params("name"))){
				res.status(400);
				return "";
			}
			if(!application.setCategory(req.params("name"), edited)) {
				res.status(400);
				return "";
			}
			
			return g.toJson(new ReturnJSON(edited.getName()));
		});

		delete("/rest/category/:name", (req, res) -> {
			if(!application.removeCategory(req.params("name"))){
				res.status(400);
				return "";
			}
			
			return "";
		});
		
		get("/rest/organizations", (req, res) -> g.toJson(application.getOrganizations()));

		post("/rest/organization", (req, res) -> {
			req.attribute("org.eclipse.jetty.multipartConfig", new MultipartConfigElement("/temp"));
			Part filePart = req.raw().getPart("logo");
			String desc = new Scanner(req.raw().getPart("desc").getInputStream()).useDelimiter("\\A").next();
			String name = new Scanner(req.raw().getPart("name").getInputStream()).useDelimiter("\\A").next();
			if(application.hasOrg(name)){
				res.status(400);
				return "";
			}
			String savedPath = savePhoto(filePart, name);

			if(savedPath == null){
				res.status(400);
				return "";
			}

			if(!application.addOrganizations(new Organization(name, desc, savedPath))){
				res.status(400);
				return "";
			}
			System.out.println("UBACEN");

			res.status(201);
			return "";
		});

		get("/rest/organization/:name", (req, res) -> g.toJson(application.getOrganizationName(req.params("name"))));

		post("/rest/organization/:name", (req, res) -> {
			Organization found = application.getOrganizationName(req.params("name"));
			if (found == null){
				res.status(400);
				return "";
			}
			req.attribute("org.eclipse.jetty.multipartConfig", new MultipartConfigElement("/temp"));
			Part filePart = req.raw().getPart("logo");
			String desc = new Scanner(req.raw().getPart("desc").getInputStream()).useDelimiter("\\A").next();
			String name = new Scanner(req.raw().getPart("name").getInputStream()).useDelimiter("\\A").next();

			if(application.hasOrgExcept(name, found.getName())){
				res.status(400);
				return "";
			}
			String path = found.getLogoPath();

			if(filePart.getSize() != 0){
				path = savePhoto(filePart, name);
			}

			found.setName(name);
			found.setDescription(desc);
			found.setLogoPath(path);

			res.status(200);
			return g.toJson(new ReturnJSON(found.getName()));

		});
		
		get("/rest/users", (req, res) -> g.toJson(application.getUsers()));

		get("/rest/users/:orgName", (req, res) -> {
			Organization org = application.getOrganizationName(req.params("orgName"));
			return g.toJson(org.getUsers());
		});


		post("/rest/user", (req, res) -> {
			User added = g.fromJson(req.body(), User.class);
			if(application.hasUser(added.getEmail())){
				res.status(400);
				return "";
			}
			application.addUsers(added);

			return "";
		});

		get("/rest/user/:email", (req, res) -> g.toJson(application.getUser(req.params("email"))));

		post("/rest/user/:email", (req, res) -> {


			User newUser = g.fromJson(req.body(), User.class);
			if(application.hasUserExcept(req.params("email"), newUser.getEmail())){
				res.status(400);
				return "";
			}
			boolean ret = application.setUser(req.params("email"), newUser);
			if(!ret){
				res.status(400);
				return "";
			}

			return g.toJson(new ReturnJSON(newUser.getEmail()));
		});

		delete("/rest/user/:email", (req, res) -> {
			if(req.params("email").equalsIgnoreCase(((User) req.session().attribute("logged")).getEmail())){
				res.status(400);
				return "";
			}
			if(application.removeUser(req.params("email")))
				res.status(200);
			else res.status(400);

			return "";
		});

	}
	
	
	private static String savePhoto(Part filePart, String name){
		try (InputStream inputStream = filePart.getInputStream()) {
			String extension = filePart.getSubmittedFileName().substring(filePart.getSubmittedFileName().lastIndexOf('.'));
			String shorterPath = "data/organization_logos/" + name.toLowerCase() + extension;
			String path = "frontend/" + shorterPath;
			File f = new File(path);
			f.createNewFile();
			OutputStream outputStream = new FileOutputStream(f);
			IOUtils.copy(inputStream, outputStream);
			outputStream.close();
			return shorterPath;
		} catch(IOException e){
			e.printStackTrace();
		}
		return null;
	}
	
	private static class ReturnJSON{
		private String location;

		public ReturnJSON(String location) {
			this.location = location;
		}
	}


}
