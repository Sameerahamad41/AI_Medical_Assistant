package com.medical.ai.controller;

import com.medical.ai.dto.ApiResponse;
import com.medical.ai.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medicine")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @GetMapping("/info")
    public ResponseEntity<ApiResponse<String>> getMedicineInfo(
            @RequestParam String name,
            Authentication authentication) {
        String info = medicineService.getMedicineInfo(authentication.getName(), name);
        return ResponseEntity.ok(ApiResponse.success("Medicine information fetched", info));
    }
}
