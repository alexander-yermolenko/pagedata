package com.yermolenko.pagedata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.InetAddress;
import java.net.URL;
import java.net.UnknownHostException;

@Service
public class PagedataService {

    private static final Logger logger = LoggerFactory.getLogger(PagedataService.class);
    private final JsoupParser jsoupParser;
    private final RestTemplate restTemplate;

    public PagedataService(JsoupParser jsoupParser) {
        this.jsoupParser = jsoupParser;
        this.restTemplate = new RestTemplate();
    }

    public Pagedata extractData(String url) {
        logger.info("Processing data extraction for URL: {}", url);
        String normalizedUrl = normalizeUrl(url);
        logger.debug("Normalized URL: {}", normalizedUrl);

        Pagedata pagedata = jsoupParser.parse(normalizedUrl);
        logger.info("Parsed page data for URL: {}", normalizedUrl);

        // Fetch IP and API data
        try {
            String hostname = new URL(normalizedUrl).getHost();
            logger.debug("Resolving hostname: {}", hostname);
            InetAddress inetAddress = InetAddress.getByName(hostname);
            String ipAddress = inetAddress.getHostAddress();
            logger.info("Resolved IP address: {} for hostname: {}", ipAddress, hostname);

            // Query ip-api.com
            String apiUrl = "http://ip-api.com/json/" + ipAddress + "?fields=66846719";
            logger.debug("Querying ip-api.com with URL: {}", apiUrl);
            IpApiData ipApiData = restTemplate.getForObject(apiUrl, IpApiData.class);

            // Validate response
            if (ipApiData != null && "success".equals(ipApiData.getStatus())) {
                logger.info("Successfully fetched IP data for IP: {}", ipAddress);
                pagedata.setIpApiData(ipApiData);
            } else {
                logger.warn("Failed to fetch IP data for IP: {}", ipAddress);
                IpApiData errorData = new IpApiData();
                errorData.setStatus("failed");
                pagedata.setIpApiData(errorData);
            }
        } catch (UnknownHostException e) {
            logger.error("Failed to resolve host: {} - {}", url, e.getMessage());
            IpApiData errorData = new IpApiData();
            errorData.setStatus("failed");
            pagedata.setIpApiData(errorData);
        } catch (Exception e) {
            logger.error("Failed to fetch IP data for URL: {} - {}", url, e.getMessage());
            IpApiData errorData = new IpApiData();
            errorData.setStatus("failed");
            pagedata.setIpApiData(errorData);
        }

        logger.info("Completed data extraction for URL: {}", url);
        return pagedata;
    }

    private String normalizeUrl(String url) {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            logger.debug("Adding https:// prefix to URL: {}", url);
            return "https://" + url;
        }
        return url;
    }
}