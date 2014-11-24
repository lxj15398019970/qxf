package cn.ld.qxf.controller.auther;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 微信易信认证服务
 * 
 * @author xjli
 * 
 */

@Controller
@RequestMapping("/sign")
public class AutherController {
	private Logger LOG = LoggerFactory.getLogger(AutherController.class);
	private final static String TOKERN = "weixiao";
	
	@RequestMapping(value = "test-map", method = RequestMethod.GET)
	public String testMap() {
		return "user-info";

	}

}
