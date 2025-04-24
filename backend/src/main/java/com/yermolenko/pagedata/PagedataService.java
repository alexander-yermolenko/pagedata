package com.yermolenko.pagedata;

import org.springframework.stereotype.Service;

@Service
public class PagedataService {

	private final JsoupParser jsoupParser;

	public PagedataService(JsoupParser jsoupParser) {
		this.jsoupParser = jsoupParser;
	}

	public Pagedata extractData(String url) {
		String normalizedUrl = normalizeUrl(url);
		return jsoupParser.parse(normalizedUrl);
	}

	private String normalizeUrl(String url) {
		if (!url.startsWith("http://") && !url.startsWith("https://")) {
			return "https://" + url;
		}
		return url;
	}
}
