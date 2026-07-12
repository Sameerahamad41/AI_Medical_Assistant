package com.medical.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private Long id;
    private String userMessage;
    private String aiResponse;
    private String category;
    private LocalDateTime timestamp;
}
