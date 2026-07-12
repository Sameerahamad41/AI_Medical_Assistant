package com.medical.ai.service;

import com.medical.ai.ai.GroqService;
import com.medical.ai.entity.ChatHistory;
import com.medical.ai.entity.User;
import com.medical.ai.repository.ChatHistoryRepository;
import com.medical.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SymptomService {

    private final GroqService groqService;
    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;

    private static final String SYSTEM_PROMPT = """
            You are a medical AI assistant specializing in symptom analysis. When given a list of symptoms:
            
            1. Identify 2-4 possible conditions/diseases
            2. For each condition provide:
               - Disease name
               - Severity level (Mild/Moderate/Severe)
               - Brief explanation
               - Home remedies (if applicable)
               - When to see a doctor
            3. Always recommend consulting a healthcare professional
            4. Do NOT provide a definitive diagnosis
            5. Format your response clearly with sections for each possible condition
            
            Structure your response as follows for each condition:
            🔹 **[Condition Name]** (Severity: [level])
            📋 Description: [brief explanation]
            🏠 Home Remedies: [remedies if mild]
            👨‍⚕️ Doctor Advice: [when to seek professional help]
            """;

    public String checkSymptoms(String email, List<String> symptoms, String additionalInfo) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String symptomList = String.join(", ", symptoms);
        String userPrompt = "My symptoms are: " + symptomList
                + (additionalInfo != null && !additionalInfo.isBlank()
                    ? "\nAdditional info: " + additionalInfo
                    : "");

        String aiResponse = groqService.sendTextPrompt(SYSTEM_PROMPT, userPrompt);

        // Save to chat history with SYMPTOM category
        chatHistoryRepository.save(ChatHistory.builder()
                .user(user)
                .userMessage("Symptoms: " + symptomList)
                .aiResponse(aiResponse)
                .category("SYMPTOM")
                .build());

        return aiResponse;
    }
}
