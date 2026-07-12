package com.medical.ai.service;

import com.medical.ai.ai.GroqService;
import com.medical.ai.entity.ImageReport;
import com.medical.ai.entity.User;
import com.medical.ai.repository.ImageReportRepository;
import com.medical.ai.repository.UserRepository;
import com.medical.ai.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ImageAnalysisService {

    private final GroqService groqService;
    private final ImageReportRepository imageReportRepository;
    private final UserRepository userRepository;
    private final FileStorageUtil fileStorageUtil;

    private static final String SYSTEM_PROMPT = """
            You are a medical AI assistant specializing in visual symptom analysis. 
            When analyzing medical images:
            
            1. Describe what you observe in the image
            2. List possible conditions based on visual symptoms
            3. Assess severity (Mild/Moderate/Severe)
            4. Recommend appropriate actions
            5. Strongly advise consulting a dermatologist/ophthalmologist/physician
            
            IMPORTANT DISCLAIMER: This is NOT a medical diagnosis. Always recommend professional evaluation.
            Visual analysis has limitations. Your response structure:
            
            🔍 **Visual Observations**: What you see
            🏥 **Possible Conditions**: List with brief explanations
            ⚡ **Severity Assessment**: Overall severity level
            🛡️ **Recommended Actions**: Immediate steps + when to see a doctor
            ⚠️ **Disclaimer**: This is for informational purposes only
            """;

    private static final String OCR_SYSTEM_PROMPT = """
            You are an advanced medical OCR and translation AI. 
            The user has uploaded an image of a medical document (e.g., lab result, prescription, bill).
            
            1. Extract the text visible in the document as accurately as possible.
            2. Identify any complex medical jargon, abbreviations, or numbers (like WBC, HbA1c).
            3. Translate and explain those terms in simple, plain English so a non-doctor can understand exactly what their results mean.
            
            Structure your response:
            📄 **Extracted Text**: (A brief summary of what you read)
            🧠 **Simple Explanation**: (What this means in plain English)
            ⚠️ **Disclaimer**: (Remind them to consult their doctor)
            """;

    public String analyzeImage(String email, MultipartFile file, String imageType) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Save image to disk
        String savedPath = fileStorageUtil.saveFile(file);

        String activePrompt = SYSTEM_PROMPT;
        String userPrompt = "Please analyze this medical image. Image type: " + imageType
                + ". Provide possible medical conditions based on what you observe.";

        if ("DOCUMENT".equalsIgnoreCase(imageType) || "LAB_RESULT".equalsIgnoreCase(imageType)) {
            activePrompt = OCR_SYSTEM_PROMPT;
            userPrompt = "Please read this medical document. Extract the text and explain what it means in simple English.";
        }

        // Get AI analysis
        String aiAnalysis = groqService.sendVisionPrompt(
                activePrompt,
                userPrompt,
                file.getBytes(),
                file.getContentType()
        );

        // Save report to DB
        imageReportRepository.save(ImageReport.builder()
                .user(user)
                .imagePath(savedPath)
                .imageType(imageType)
                .aiAnalysis(aiAnalysis)
                .build());

        return aiAnalysis;
    }
}
