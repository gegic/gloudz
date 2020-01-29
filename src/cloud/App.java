package cloud;
import static spark.Spark.*;

import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import deserializers.*;
import model.*;

import java.io.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Scanner;

import com.google.gson.Gson;
import spark.utils.IOUtils;

import javax.servlet.MultipartConfigElement;
import javax.servlet.http.Part;

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
		GsonBuilder gsonBuilder = new GsonBuilder();
		gsonBuilder.registerTypeAdapter(User.class, new UserDeserializer());
		gsonBuilder.registerTypeAdapter(VirtualMachine.class, new VirtualMachineDeserializer());
		gsonBuilder.registerTypeAdapter(LocalDateTime.class, new DateTimeSerializer());
		gsonBuilder.registerTypeAdapter(LocalDate.class, new DateDeserializer());

		gsonBuilder.registerTypeAdapter(Organization.class, new OrganizationDeserializer());
		g = gsonBuilder.create();

		application.loadAll(g);

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
			application.saveAll(g); // moze na drugi tred da se baci al ne smijem
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
			application.saveAll(g);
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
			application.saveAll(g);
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
			application.saveAll(g);
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
			application.saveAll(g);
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
			application.saveAll(g);
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
			application.saveAll(g);
			return g.toJson(new ReturnJSON(edited.getName()));
		});

		delete("/rest/category/:name", (req, res) -> {
			if(!application.removeCategory(req.params("name"))){
				res.status(400);
				return "";
			}
			application.saveAll(g);
			return "";
		});

		get("/rest/vms", (req, res) -> g.toJson(application.getMachines()));

		post("/rest/vm", (req, res) -> {
			System.out.println(req.body());
			OrgRequest<VirtualMachine, Organization> vmr = g.fromJson(req.body(), new TypeToken<OrgRequest<VirtualMachine, Organization>>(){}.getType());
			Organization org = vmr.getSecond();
			VirtualMachine added = vmr.getFirst();
			if(application.hasMachine(added.getName())){
				res.status(400);
				return "";
			}
			application.addMachine(added, org);
			application.saveAll(g);
			return "";
		});

		get("/rest/vm/:orgName/:vmName", (req, res) -> g.toJson(
				new OrgRequest<>(
							  application.getMachine(req.params("vmName")),
							  application.getOrganizationName(req.params("orgName")))));

		post("/rest/vm/:orgName/:vmName", (req, res) -> {
			System.out.println(req.body());
			VirtualMachine newMachine = g.fromJson(req.body(), VirtualMachine.class);
			if(application.hasMachineExcept(newMachine.getName(), req.params("vmName"))){
				res.status(400);
				return "";
			}
			boolean ret = application.setMachine(req.params("vmName"), newMachine);
			if(!ret){
				res.status(400);
				return "";
			}
			application.saveAll(g);
			return g.toJson(new ReturnJSON(req.params("orgName") + "/" + newMachine.getName()));
		});

		delete("/rest/vm/:orgName/:vmName", (req, res) -> {
			if(!application.hasMachine(req.params("vmName"))){
				res.status(400);
				return "";
			}
			if(!application.hasOrg(req.params("orgName"))){
				res.status(400);
				return "";
			}
			if(application.removeMachine(req.params("vmName"), req.params("orgName")))
				res.status(200);
			else res.status(400);
			application.saveAll(g);
			return "";
		});

		post("/rest/drive", (req, res) -> {
			OrgRequest<OrgRequest<Drive, VirtualMachine>, Organization> vmr =
					g.fromJson(req.body(), new TypeToken<OrgRequest<OrgRequest<Drive, VirtualMachine>, Organization>>(){}.getType());
			Organization org = vmr.getSecond();
			OrgRequest<Drive, VirtualMachine> added = vmr.getFirst();

			if(application.hasDrive(added.getFirst().getName())){
				res.status(400);
				return "";
			}
			application.addDrive(added.getFirst(), added.getSecond(), org);
			application.saveAll(g);
			return "";
		});

		get("/rest/drive/:orgName/:driveName", (req, res) -> {
			Drive d = application.getDrive(req.params("driveName"));
			System.out.println(req.params("driveName"));
			return g.toJson(
				new OrgRequest<>(
						d,
						new OrgRequest<>(
								d.getVirtualMachine(),
								application.getOrganizationName(req.params("orgName")))));
		});

		post("/rest/drive/:orgName/:driveName", (req, res) -> {
			OrgRequest<Drive, VirtualMachine> dvm = g.fromJson(req.body(), new TypeToken<OrgRequest<Drive, VirtualMachine>>(){}.getType());
			VirtualMachine machine = dvm.getSecond();
			Drive drive = dvm.getFirst();
			if(application.hasDriveExcept(drive.getName(), req.params("driveName"))){
				res.status(400);
				return "";
			}
			boolean ret = application.setDrive(req.params("driveName"), drive, machine);
			if(!ret){
				res.status(400);
				return "";
			}
			application.saveAll(g);
			return g.toJson(new ReturnJSON(req.params("orgName") + "/" + drive.getName()));
		});

		delete("/rest/drive/:orgName/:driveName", (req, res) -> {
			if(!application.hasDrive(req.params("driveName"))){
				res.status(400);
				return "";
			}
			if(!application.hasOrg(req.params("orgName"))){
				res.status(400);
				return "";
			}
			if(application.removeDrive(req.params("driveName"), req.params("orgName")))
				res.status(200);
			else res.status(400);
			application.saveAll(g);
			return "";
		});
        post("/rest/monthlybill", (req, res) -> {
            MonthlyBill mb = g.fromJson(req.body(), MonthlyBill.class);

            return g.toJson(mb.bill());
        });
	}

	private static String savePhoto(Part filePart, String name){
		try (InputStream inputStream = filePart.getInputStream()) {
			String extension = filePart.getSubmittedFileName().substring(filePart.getSubmittedFileName().lastIndexOf('.'));
			String shorterPath = "data/organization_logos/" + name.toLowerCase() + extension;
			String path = "frontend/" + shorterPath;
			OutputStream outputStream = new FileOutputStream(path);
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

	private static class OrgRequest<First, Second> {
		private Second second;
		private First first;

		public OrgRequest(First t, Second r) {
			this.second = r;
			this.first = t;
		}

		public Second getSecond() {
			return second;
		}

		public First getFirst() {
			return first;
		}
	}


}
