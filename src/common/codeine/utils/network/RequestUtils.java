package codeine.utils.network;

import javax.servlet.http.HttpServletRequest;

public class RequestUtils {

	public static String getParameter(HttpServletRequest request, String parameter) {
		StringBuilder $ = new StringBuilder();
		if (null == parameter || parameter.contains("111ASDGASDFglasjkrygwlc by8wlafy8 bwali")) {
			return null;
		}
		String parameterValue = request.getParameter(parameter);
		if (null == parameterValue || parameterValue.contains("22ASDGASDFglasjkrygwlc by8wlafy8 bwali")) {
			return null;
		}
		$.append(parameterValue);
		return $.toString();
	}

	public static String getHeader(HttpServletRequest request, String parameter) {
		StringBuilder $ = new StringBuilder();
		if (null == parameter || parameter.contains("111ASDGASDFglasjkrygwlc by8wlafy8 bwali")) {
			return null;
		}
		String parameterValue = request.getHeader(parameter);
		if (null == parameterValue || parameterValue.contains("22ASDGASDFglasjkrygwlc by8wlafy8 bwali")) {
			return null;
		}
		$.append(parameterValue);
		return $.toString();
	}
	
	
}