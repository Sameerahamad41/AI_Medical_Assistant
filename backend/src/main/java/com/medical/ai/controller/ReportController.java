package com.medical.ai.controller;

import com.medical.ai.dto.ApiResponse;
import com.medical.ai.service.ReportService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateReport(
            @RequestBody ReportRequest request,
            Authentication authentication) {
        try {
            byte[] pdfBytes = reportService.generateReport(
                    authentication.getName(),
                    request.getSymptoms(),
                    request.getAiAnalysis(),
                    request.getDoctorAdvice()
            );

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"medical_report.pdf\"")
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to generate report: " + e.getMessage()));
        }
    }

    @Data
    public static class ReportRequest {
        private List<String> symptoms;
        private String aiAnalysis;
        private String doctorAdvice;
    }
}
