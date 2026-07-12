package com.medical.ai.service;

import com.medical.ai.ai.GroqService;
import com.medical.ai.entity.ChatHistory;
import com.medical.ai.entity.User;
import com.medical.ai.repository.ChatHistoryRepository;
import com.medical.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final GroqService groqService;
    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;

    private static final String SYSTEM_PROMPT = """
            You are a pharmaceutical AI assistant. When asked about a medicine, provide:
            
            💊 **Uses**: What the medicine treats
            📏 **Dosage**: Common adult and pediatric dosages (general guidance only)
            ⚠️ **Side Effects**: Common and serious side effects
            🚫 **Warnings & Contraindications**: Who should avoid it, drug interactions
            🔄 **Alternatives**: Generic or alternative medicines
            🏥 **Prescription Status**: OTC or prescription only
            
            IMPORTANT: Always remind users to follow their doctor's prescription and consult a 
            pharmacist before taking any medication. This information is for educational purposes only.
            """;

    public String getMedicineInfo(String email, String medicineName) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String userPrompt = "Tell me about the medicine: " + medicineName;
        String aiResponse = groqService.sendTextPrompt(SYSTEM_PROMPT, userPrompt);

        chatHistoryRepository.save(ChatHistory.builder()
                .user(user)
                .userMessage("Medicine info: " + medicineName)
                .aiResponse(aiResponse)
                .category("MEDICINE")
                .build());

        return aiResponse;
    }
}
