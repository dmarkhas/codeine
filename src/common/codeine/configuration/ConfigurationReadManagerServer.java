package codeine.configuration;

import java.util.List;
import java.util.Map;

import javax.inject.Inject;

import org.apache.log4j.Logger;

import codeine.exceptions.ProjectNotFoundException;
import codeine.jsons.project.ProjectJson;
import codeine.model.Constants;
import codeine.utils.FilesUtils;
import codeine.utils.JsonFileUtils;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

public class ConfigurationReadManagerServer implements IConfigurationManager
{
	private static final Logger log = Logger.getLogger(ConfigurationReadManagerServer.class);
	
	public static final ProjectJson NODES_INTERNAL_PROJECT = new ProjectJson(Constants.CODEINE_NODES_PROJECT_NAME);
	
	
	private Map<String, ProjectJson> projects = Maps.newHashMap();
	private JsonFileUtils jsonFileUtils;
	private PathHelper pathHelper;
	
	@Inject
	public ConfigurationReadManagerServer(JsonFileUtils jsonFileUtils, PathHelper pathHelper)
	{
		this.jsonFileUtils = jsonFileUtils; 
		this.pathHelper = pathHelper;
		refresh();
	}

	@Override
	public void refresh() {
		Map<String, ProjectJson> projects1 = Maps.newHashMap();
		try {
			String projectsDir = pathHelper.getProjectsDir();
			log.info("loading configuration, projects from " + projectsDir);
			List<String> files = FilesUtils.getFilesInDir(projectsDir);
			for (String file : files) {
				try {
					if (file.startsWith(".")){
						log.info("will ignore project dir " + file);
						continue;
					}
					String file2 = pathHelper.getProjectsDir() + "/" + file + "/" + Constants.PROJECT_CONF_FILE;
					if (!FilesUtils.exists(file2)) {
						log.info("conf file not exists " + file2);
						continue;
					}
					ProjectJson projectJson = jsonFileUtils.getConfFromFile(file2, ProjectJson.class);
					projects1.put(projectJson.name(), projectJson);
					FilesUtils.mkdirs(pathHelper.getPluginsOutputDir(projectJson.name()));
				} catch (Exception e) {
					log.error("failed to configure project " + file, e);
				}
			}
		} catch (RuntimeException e) {
			log.error("error", e);
			throw e;
		}
		projects = projects1;
	}

	@Override
	public List<ProjectJson> getConfiguredProjects() {
		return Lists.newArrayList(projects().values());
	}
	
	@Override
	public ProjectJson getProjectForName(String projectName) {
		if (Constants.CODEINE_NODES_PROJECT_NAME.equals(projectName)) {
			return NODES_INTERNAL_PROJECT;
		}
		List<ProjectJson> configuredProjects = getConfiguredProjects();
		for (ProjectJson projectJson : configuredProjects) {
			if (projectName.equals(projectJson.name())){
				return projectJson;
			}
		}
		throw new ProjectNotFoundException(projectName);
	}

	public Map<String, ProjectJson> projects() {
		return projects;
	}

	public void projects(Map<String, ProjectJson> projects) {
		this.projects = projects;
	}

	@Override
	public boolean hasProject(String projectName) {
		return projects.containsKey(projectName);
	}
}
