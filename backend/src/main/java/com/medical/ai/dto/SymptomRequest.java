package com.medical.ai.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class SymptomRequest {

    @NotEmpty(message = "At least one symptom is required")
    private List<String> symptoms;

    private String additionalInfo;
}
