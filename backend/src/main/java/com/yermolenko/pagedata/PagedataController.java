package com.yermolenko.pagedata;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("api/page")
public class PagedataController {

    private static final Logger logger = LoggerFactory.getLogger(PagedataController.class);
    private final PagedataService seodataService;

    public PagedataController(PagedataService seodataService) {
        this.seodataService = seodataService;
    }
    
    @GetMapping("/extract")
    public ResponseEntity<Pagedata> extractGet(@RequestParam String url) {
        logger.info("Received GET request to extract data for URL: {}", url);
        return ResponseEntity.ok(seodataService.extractData(url));
    }

    @PostMapping("/extract")
    public ResponseEntity<Pagedata> extractPost(@RequestParam String url) {
        logger.info("Received POST request to extract data for URL: {}", url);
        return ResponseEntity.ok(seodataService.extractData(url));
    }
}