package yami;

import java.io.*;
import java.util.*;
import java.util.concurrent.*;

import javax.servlet.http.*;

import org.apache.log4j.*;
import org.eclipse.jetty.server.*;
import org.eclipse.jetty.server.handler.*;
import org.eclipse.jetty.servlet.*;

import yami.configuration.*;
import yami.model.*;

public class YamiClientBootstrap
{
	private static final Logger log = Logger.getLogger(YamiClientBootstrap.class);
	ConfigurationManager cm;
	public static void main(String[] args)
	{
		try
		{
			setLogger(Constants.getInstallDir() + "/" + Constants.CLIENT_LOG);
			new YamiClientBootstrap().execute();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.exit(1);
		}
	}
	
	private void execute() throws Exception
	{
		cm = ConfigurationManager.getInstance();
		int port = cm.getCurrentGlobalConfiguration().getClientPort();
		String hostname = java.net.InetAddress.getLocalHost().getHostName();
		log.info("Client will try to start on port " + port + " from directory " + Constants.getInstallDir());
		List<Node> nodes = Nodes.getNodes(hostname, DataStoreRetriever.getD());
		startNodeMonitoringThreads(nodes);
		ContextHandlerCollection contexts = createFileServerContexts(nodes, hostname);
		PeerRestartServlet rs = new PeerRestartServlet();
		ServletContextHandler restartServlet = createServletContext(Constants.RESTART_CONTEXT, rs);
		contexts.addHandler(restartServlet);
		contexts.addHandler(createLogContextHandler());
		log.info("Starting server at port " + port);
		Server peerHTTPserver = new Server(port);
		peerHTTPserver.setHandler(contexts);
		rs.setStoppedObject(peerHTTPserver);
		peerHTTPserver.start();
		peerHTTPserver.join();
		while (true)
		{
			log.info("HTTP server is stopped. Sleeping for 20 seconds");
			Thread.sleep(TimeUnit.SECONDS.toMillis(20));
		}
	}
	
	private void startNodeMonitoringThreads(List<Node> nodes)
	{
		for (Node node : nodes)
		{
			log.debug("Starting PeriodicExecuter thread for node " + node.name);
			new Thread(new PeriodicExecuter(20, new RunMonitors(node))).start();
		}
	}
	
	// create the directory structure under "path" if does not already exists:
	private void createFileSystem(String path)
	{
		log.debug("Will try to create directory structure " + path);
		File f = new File(path);
		if (f.exists())
		{
			return;
		}
		if (f.mkdirs() == false)
		{
			log.fatal("Failed to create directory structure " + path);
			System.exit(2);
		}
	}
	
	// logger initialization:
	private static void setLogger(String logfile) throws IOException
	{
		String pattern = "%d{ISO8601} [%c] %p %m %n";
		PatternLayout layout = new PatternLayout(pattern);
		RollingFileAppender appender = new RollingFileAppender(layout, logfile, true);
		appender.setMaxBackupIndex(5);
		appender.setMaximumFileSize(10 * 1000000);
		Logger.getRootLogger().addAppender(appender);
		Logger.getRootLogger().setLevel(Level.INFO);
		if (System.getProperty("debug") != null && System.getProperty("debug").equals("true"))
		{
			Logger.getRootLogger().setLevel(Level.DEBUG);
		}
	}
	
	// returns a collection of contexts (Context per node)
	private ContextHandlerCollection createFileServerContexts(List<Node> nodes, String hostname)
	{
		ContextHandlerCollection contexts = new ContextHandlerCollection();
		for (Node node : nodes)
		{
			String filesPath = Constants.getInstallDir() + Constants.NODES_DIR + node.name;
			createFileSystem(filesPath);
			contexts.addHandler(createStaticContextHandler("/" + node.name, filesPath));
			log.debug(hostname + ":" + node.name + " is served under " + filesPath);
		}
		return contexts;
	}
	
	private ContextHandler createLogContextHandler()
	{
		String logdir = Constants.getInstallDir() + Constants.LOG_DIR;
		log.debug("Creating log Context Handler under " + logdir);
		return createStaticContextHandler("/", logdir);
	}
	
	private ContextHandler createStaticContextHandler(String contextPath, String fsPath)
	{
		ResourceHandler resourceHandler = new ResourceHandler();
		resourceHandler.setDirectoriesListed(true);
		resourceHandler.setWelcomeFiles(new String[] {});
		resourceHandler.setResourceBase(fsPath);
		ContextHandler ch = new ContextHandler();
		ch.setContextPath(contextPath);
		ch.setHandler(resourceHandler);
		return ch;
	}
	
	private ServletContextHandler createServletContext(String context, HttpServlet servlet)
	{
		log.info("Creating servlet context at '" + context + "'");
		ServletContextHandler monitorContext = new ServletContextHandler(ServletContextHandler.NO_SESSIONS);
		monitorContext.setContextPath(context);
		monitorContext.addServlet(new ServletHolder(servlet), "/");
		return monitorContext;
	}	
}
