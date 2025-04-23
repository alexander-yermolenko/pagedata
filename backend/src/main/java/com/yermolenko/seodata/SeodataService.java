package com.yermolenko.seodata;

import org.springframework.stereotype.Service;

@Service
public class SeodataService {

	private final JsoupParser jsoupParser;

	public SeodataService(JsoupParser jsoupParser) {
		this.jsoupParser = jsoupParser;
	}

	public Seodata extractData(String url) {
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
