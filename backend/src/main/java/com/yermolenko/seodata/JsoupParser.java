package com.yermolenko.seodata;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JsoupParser {

	public Seodata parse(String url) {
		Seodata seodata = new Seodata();

		try {
			Document doc = Jsoup.connect(url).get();

			// Meta and Head data
			seodata.setTitle(doc.title());
			seodata.setMetaNameDescription(getMetaTag(doc, "name", "description"));
			seodata.setMetaNameRobots(getMetaTag(doc, "name", "robots"));
			seodata.setMetaNameViewport(getMetaTag(doc, "name", "viewport"));
			seodata.setMetaCharset(doc.select("meta[charset]").attr("charset"));
			seodata.setMetaNameKeywords(getMetaTag(doc, "name", "keywords"));
			seodata.setLinkRelCanonical(doc.select("link[rel=canonical]").attr("href"));

			// Open Graph tags
			seodata.setMetaPropertyOgTitle(getMetaTag(doc, "property", "og:title"));
			seodata.setMetaPropertyOgUrl(getMetaTag(doc, "property", "og:url"));
			seodata.setMetaPropertyOgDescription(getMetaTag(doc, "property", "og:description"));
			seodata.setMetaPropertyOgImage(getMetaTag(doc, "property", "og:image"));

			// HTML5 semantic tags
			seodata.setH1(getAllTexts(doc, "h1"));
			seodata.setH2(getAllTexts(doc, "h2"));
			seodata.setH3(getAllTexts(doc, "h3"));
			seodata.setH4(getAllTexts(doc, "h4"));
			seodata.setH5(getAllTexts(doc, "h5"));
			seodata.setH6(getAllTexts(doc, "h6"));
			seodata.setArticle(getAllTexts(doc, "article"));
			seodata.setAudio(getAllTexts(doc, "audio"));
			seodata.setDetails(getAllTexts(doc, "details"));
			seodata.setDialog(getAllTexts(doc, "dialog"));
			seodata.setEmbed(getAllTexts(doc, "embed"));
			seodata.setFooter(getAllTexts(doc, "footer"));
			seodata.setHeader(getAllTexts(doc, "header"));
			// seodata.setMain(getAllTexts(doc, "main"));
			seodata.setNav(getAllTexts(doc, "nav"));
			seodata.setPicture(getAllTexts(doc, "picture"));
			seodata.setSource(getAllTexts(doc, "source"));
			seodata.setSummary(getAllTexts(doc, "summary"));
			seodata.setSvg(getAllTexts(doc, "svg"));
			seodata.setTime(getAllTexts(doc, "time"));
			seodata.setVideo(getAllTexts(doc, "video"));
			seodata.setImg(getAllAttributes(doc, "img", "src"));
			seodata.setA(getAllAttributes(doc, "a", "href"));

		} catch (IOException e) {
			throw new RuntimeException("Failed to connect: " + url, e);
		}

		return seodata;
	}

	private String getMetaTag(Document doc, String key, String value) {
		Element element = doc.selectFirst("meta[" + key + "=" + value + "]");
		return element != null ? element.attr("content") : null;
	}

	private List<String> getAllTexts(Document doc, String tag) {
		Elements elements = doc.select(tag);
		return elements.stream().map(Element::text).filter(text -> !text.isEmpty()).collect(Collectors.toList());
	}

	private List<String> getAllAttributes(Document doc, String tag, String attribute) {
		Elements elements = doc.select(tag);
		return elements.stream().map(element -> element.attr(attribute)).filter(attr -> !attr.isEmpty())
				.collect(Collectors.toList());
	}
}