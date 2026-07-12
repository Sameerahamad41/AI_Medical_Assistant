package com.medical.ai.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    @GetMapping("/hospitals")
    public ResponseEntity<String> getNearbyHospitals(@RequestParam double lat, @RequestParam double lon) {
        try {
            // Using nwr and out center to catch all hospitals (nodes, ways, polygons)
            String query = String.format("[out:json];nwr(around:10000,%s,%s)[amenity=hospital];out center;", lat, lon);
            String url = "https://overpass-api.de/api/interpreter?data=" + query;

            RestTemplate restTemplate = new RestTemplate();
            
            // Overpass API sometimes requires a valid User-Agent to avoid blocks
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "AIMedicalAssistantBackend/1.0");
            HttpEntity<String> entity = new HttpEntity<>("parameters", headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"Failed to fetch from Overpass\"}");
        }
    }
}
