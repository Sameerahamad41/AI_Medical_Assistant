package com.medical.ai.controller;

import com.medical.ai.dto.ApiResponse;
import com.medical.ai.dto.ChatRequest;
import com.medical.ai.dto.ChatResponse;
import com.medical.ai.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/message")
    public ResponseEntity<ApiResponse<ChatResponse>> sendMessage(
            @Valid @RequestBody ChatRequest request,
            Authentication authentication) {
        ChatResponse response = chatService.sendMessage(
                authentication.getName(),
                request.getMessage(),
                request.getCategory()
        );
        return ResponseEntity.ok(ApiResponse.success("Message processed", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<ChatResponse>>> getChatHistory(Authentication authentication) {
        List<ChatResponse> history = chatService.getChatHistory(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Chat history fetched", history));
    }
}
