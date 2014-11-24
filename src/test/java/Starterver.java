


import org.mortbay.jetty.Server;

/** 
 * 使用Jetty运行调试Web应用, 在Console输入回车停止服务.
 * 
 */
public class Starterver {

	public static final int PORT = 8087;
	public static final String CONTEXT = "/qxf";
	public static final String BASE_URL = "http://localhost:8087/qxf/sign/test-map.shtml";
	public static void main(String[] args) throws Exception {
           // System.setProperty("spring.profiles.active", "development");
		Server server = JettyFactory.buildNormalServer(PORT, CONTEXT);
		server.start();
		System.out.println("Server running at " + BASE_URL);
		System.out.println("Hit Enter in console to stop server");
		if (System.in.read() != 0) {
			server.stop();
			System.out.println("Server stopped");
		}
	}


}
