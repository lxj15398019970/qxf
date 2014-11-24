import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.cxf.jaxrs.ext.search.visitor.SBThreadLocalVisitorState;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.NicelyResynchronizingAjaxController;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebClientOptions;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


public class NioTest {
	public static void main(String[] args) throws IOException {
           String url = "https://plus.yixin.im/login?service=https//plus.yixin.im/index";
		
		 WebClient webclient = null;
	            webclient = new WebClient(BrowserVersion.INTERNET_EXPLORER_9);
	            webclient.setAjaxController(new NicelyResynchronizingAjaxController());
	            WebClientOptions options = webclient.getOptions();
	            options.setJavaScriptEnabled(true);
	            options.setRedirectEnabled(true);
	            options.setActiveXNative(false);
	            options.setAppletEnabled(false);
	            options.setCssEnabled(false);
	            options.setDoNotTrackEnabled(false);
	            options.setGeolocationEnabled(false);
	            options.setUseInsecureSSL(true);
	            options.setThrowExceptionOnFailingStatusCode(false);
	            options.setThrowExceptionOnScriptError(false);
	            options.setPrintContentOnFailingStatusCode(false);
	            HtmlPage page = webclient.getPage(url);
	            System.out.println(page.asXml());
	      //     webclient.addRequestHeader("Host","plus.yixin.im");
	         //   webclient.addRequestHeader("","https://plus.yixin.im/login");
	            HtmlElement account = page.getElementByName("username");
	            HtmlElement password = page.getElementByName("passwordx");
	            HtmlElement submit = (HtmlElement) page.getElementById("submit-button");
	            
	            account.type("xiaoyuanyun00122@163.com");
	            password.type("189189");
	            
	            page = submit.click();
	            
	            System.out.println(page.asXml());
	            
		
	}

}
