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
            String query = String.format("[out:json];(nwr(around:10000,%s,%s)[amenity=hospital];nwr(around:10000,%s,%s)[amenity=clinic];);out center;", lat, lon, lat, lon);
            String url = "https://lz4.overpass-api.de/api/interpreter";

            RestTemplate restTemplate = new RestTemplate();
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "AIMedicalAssistantBackend/1.0");
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);
            
            String body = "data=" + java.net.URLEncoder.encode(query, "UTF-8");
            HttpEntity<String> entity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"Failed to fetch from Overpass: " + e.getMessage() + "\"}");
        }
    }
}
