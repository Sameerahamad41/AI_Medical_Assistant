package com.medical.ai.service;

import com.medical.ai.ai.GroqService;
import com.medical.ai.dto.ChatResponse;
import com.medical.ai.entity.ChatHistory;
import com.medical.ai.entity.User;
import com.medical.ai.repository.ChatHistoryRepository;
import com.medical.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final GroqService groqService;
    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;

    private static final String SYSTEM_PROMPT = """
            You are an AI medical assistant. Your role is to provide helpful, accurate, and empathetic 
            medical information to users. Always:
            - Be clear and easy to understand
            - Recommend consulting a doctor for serious symptoms
            - Never provide a definitive diagnosis
            - Suggest home remedies when appropriate
            - Mention warning signs that require immediate medical attention
            - Be compassionate and supportive
            
            IMPORTANT: Always end your response with a disclaimer that this is not a substitute for 
            professional medical advice.
            
            If the user asks for a doctor recommendation or wants to book an appointment, 
            you MUST end your entire response with exactly this string: [REDIRECT_TO_APPOINTMENT]
            """;

    public ChatResponse sendMessage(String email, String message, String category) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String aiResponse = groqService.sendTextPrompt(SYSTEM_PROMPT, message);

        ChatHistory chatHistory = ChatHistory.builder()
                .user(user)
                .userMessage(message)
                .aiResponse(aiResponse)
                .category(category != null ? category : "CHAT")
                .build();

        ChatHistory saved = chatHistoryRepository.save(chatHistory);

        return ChatResponse.builder()
                .id(saved.getId())
                .userMessage(message)
                .aiResponse(aiResponse)
                .category(saved.getCategory())
                .timestamp(saved.getTimestamp())
                .build();
    }

    public List<ChatResponse> getChatHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return chatHistoryRepository.findByUserIdOrderByTimestampDesc(user.getId())
                .stream()
                .map(chat -> ChatResponse.builder()
                        .id(chat.getId())
                        .userMessage(chat.getUserMessage())
                        .aiResponse(chat.getAiResponse())
                        .category(chat.getCategory())
                        .timestamp(chat.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }
}
