package com.medical.ai.controller;

import com.medical.ai.dto.ApiResponse;
import com.medical.ai.service.ImageAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/image")
@RequiredArgsConstructor
public class ImageController {

    private final ImageAnalysisService imageAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<String>> analyzeImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "OTHER") String imageType,
            Authentication authentication) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Please upload an image file"));
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Only image files are allowed"));
            }

            String result = imageAnalysisService.analyzeImage(
                    authentication.getName(), file, imageType
            );
            return ResponseEntity.ok(ApiResponse.success("Image analyzed successfully", result));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to analyze image: " + e.getMessage()));
        }
    }
}
