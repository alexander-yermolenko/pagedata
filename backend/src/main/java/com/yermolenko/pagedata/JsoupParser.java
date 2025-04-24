package com.yermolenko.pagedata;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JsoupParser {

    private static final Logger logger = LoggerFactory.getLogger(JsoupParser.class);

    public Pagedata parse(String url) {
        logger.info("Starting HTML parsing for URL: {}", url);
        Pagedata pagedata = new Pagedata();

        try {
            logger.debug("Connecting to URL: {}", url);
            Document doc = Jsoup.connect(url).get();
            logger.info("Successfully fetched document for URL: {}", url);

            // Meta and Head data
            pagedata.setTitle(doc.title());
            logger.debug("Extracted title: {}", doc.title());
            pagedata.setMetaNameDescription(getMetaTag(doc, "name", "description"));
            pagedata.setMetaNameRobots(getMetaTag(doc, "name", "robots"));
            pagedata.setMetaNameViewport(getMetaTag(doc, "name", "viewport"));
            pagedata.setMetaCharset(doc.select("meta[charset]").attr("charset"));
            pagedata.setMetaNameKeywords(getMetaTag(doc, "name", "keywords"));
            pagedata.setLinkRelCanonical(doc.select("link[rel=canonical]").attr("href"));

            // Open Graph tags
            pagedata.setMetaPropertyOgTitle(getMetaTag(doc, "property", "og:title"));
            pagedata.setMetaPropertyOgUrl(getMetaTag(doc, "property", "og:url"));
            pagedata.setMetaPropertyOgDescription(getMetaTag(doc, "property", "og:description"));
            pagedata.setMetaPropertyOgImage(getMetaTag(doc, "property", "og:image"));

            // HTML5 semantic tags
            pagedata.setH1(getAllTexts(doc, "h1"));
            pagedata.setH2(getAllTexts(doc, "h2"));
            pagedata.setH3(getAllTexts(doc, "h3"));
            pagedata.setH4(getAllTexts(doc, "h4"));
            pagedata.setH5(getAllTexts(doc, "h5"));
            pagedata.setH6(getAllTexts(doc, "h6"));
            pagedata.setArticle(getAllTexts(doc, "article"));
            pagedata.setAudio(getAllTexts(doc, "audio"));
            pagedata.setDetails(getAllTexts(doc, "details"));
            pagedata.setDialog(getAllTexts(doc, "dialog"));
            pagedata.setEmbed(getAllTexts(doc, "embed"));
            pagedata.setFooter(getAllTexts(doc, "footer"));
            pagedata.setHeader(getAllTexts(doc, "header"));
            pagedata.setNav(getAllTexts(doc, "nav"));
            pagedata.setPicture(getAllTexts(doc, "picture"));
            pagedata.setSource(getAllTexts(doc, "source"));
            pagedata.setSummary(getAllTexts(doc, "summary"));
            pagedata.setSvg(getAllTexts(doc, "svg"));
            pagedata.setTime(getAllTexts(doc, "time"));
            pagedata.setVideo(getAllTexts(doc, "video"));
            pagedata.setImg(getAllAttributes(doc, "img", "src"));
            pagedata.setA(getAllAttributes(doc, "a", "href"));

            logger.info("Completed HTML parsing for URL: {}", url);
        } catch (IOException e) {
            logger.error("Failed to parse URL: {} - {}", url, e.getMessage());
            throw new RuntimeException("Failed to connect: " + url, e);
        }

        return pagedata;
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