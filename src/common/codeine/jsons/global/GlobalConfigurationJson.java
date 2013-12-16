package codeine.jsons.global;

import java.util.List;

import codeine.configuration.EmailConfiguration;
import codeine.jsons.auth.AuthenticationMethod;
import codeine.model.Constants;

import com.google.common.collect.Lists;

public class GlobalConfigurationJson
{
	private Integer web_server_port = Constants.DEFAULT_WEB_SERVER_PORT;
	private Integer directory_port = 12348;
	private Integer mail_server_port = 12349;
	private String directory_host;
	private String admin_mail;
	private EmailConfiguration email_configuration;
	private String web_server_host;
	private List<String> db_host = Lists.newArrayList();  //TODO should be removed, only for mongo
	private AuthenticationMethod authentication_method = AuthenticationMethod.Disabled;
	private List<MysqlConfigurationJson> mysql = Lists.newArrayList();
	private String[] roles = {};
	private boolean large_deployment;

	public GlobalConfigurationJson() {
	}
	public GlobalConfigurationJson(String hostName) {
		web_server_host = hostName;
		directory_host = hostName;
		
	}

	public Integer web_server_port() {
		return web_server_port;
	}

	public String admin_mail() {
		return admin_mail;
	}

	public List<String> db_host() {
		return db_host;
	}

	public String directory_host() {
		return directory_host;
	}

	public Integer directory_port() {
		return directory_port;
	}

	public String web_server_host() {
		return web_server_host;
	}

	public EmailConfiguration email_configuration() {
		return email_configuration;
	}

	public int mail_server_port() {
		return mail_server_port;
	}

	public AuthenticationMethod authentication_method() {
		return authentication_method;
	}

	public List<MysqlConfigurationJson> mysql() {
		return mysql;
	}

	public String[] roles() {
		return roles;
	}
	public boolean large_deployment() {
		return large_deployment;
	}
	
}
