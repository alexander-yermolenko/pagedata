package com.yermolenko.pagedata;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("api/page")
public class PagedataController {

    private final PagedataService seodataService;

    public PagedataController(PagedataService seodataService) {
        this.seodataService = seodataService;
    }
    
    @GetMapping("/extract")
    public ResponseEntity<Pagedata> extractGet(@RequestParam String url) {
        return ResponseEntity.ok(seodataService.extractData(url));
    }

    @PostMapping("/extract")
    public ResponseEntity<Pagedata> extractPost(@RequestParam String url) {
		return ResponseEntity.ok(seodataService.extractData(url));
	}
}
