package com.yermolenko.seodata;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("api/seo")
public class SeodataController {

    private final SeodataService seodataService;

    public SeodataController(SeodataService seodataService) {
        this.seodataService = seodataService;
    }
    
    @GetMapping("/extract")
    public ResponseEntity<Seodata> extractGet(@RequestParam String url) {
        return ResponseEntity.ok(seodataService.extractData(url));
    }

    @PostMapping("/extract")
    public ResponseEntity<Seodata> extractPost(@RequestParam String url) {
		return ResponseEntity.ok(seodataService.extractData(url));
	}
}
