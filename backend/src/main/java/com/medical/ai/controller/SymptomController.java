package com.medical.ai.controller;

import com.medical.ai.dto.ApiResponse;
import com.medical.ai.dto.SymptomRequest;
import com.medical.ai.service.SymptomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/symptoms")
@RequiredArgsConstructor
public class SymptomController {

    private final SymptomService symptomService;

    @PostMapping("/check")
    public ResponseEntity<ApiResponse<String>> checkSymptoms(
            @Valid @RequestBody SymptomRequest request,
            Authentication authentication) {
        String result = symptomService.checkSymptoms(
                authentication.getName(),
                request.getSymptoms(),
                request.getAdditionalInfo()
        );
        return ResponseEntity.ok(ApiResponse.success("Symptom analysis complete", result));
    }
}
