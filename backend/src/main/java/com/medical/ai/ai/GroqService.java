package com.medical.ai.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
@Slf4j
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.model.text}")
    private String textModel;

    @Value("${groq.model.vision}")
    private String visionModel;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Send a text prompt to Groq and receive a text response.
     */
    public String sendTextPrompt(String systemPrompt, String userPrompt) {
        try {
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", textModel);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 1024);

            ArrayNode messages = objectMapper.createArrayNode();

            ObjectNode systemMsg = objectMapper.createObjectNode();
            systemMsg.put("role", "system");
            systemMsg.put("content", systemPrompt);
            messages.add(systemMsg);

            ObjectNode userMsg = objectMapper.createObjectNode();
            userMsg.put("role", "user");
            userMsg.put("content", userPrompt);
            messages.add(userMsg);

            requestBody.set("messages", messages);

            HttpEntity<String> entity = new HttpEntity<>(
                    objectMapper.writeValueAsString(requestBody),
                    buildHeaders()
            );

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.POST, entity, String.class
            );

            return parseTextResponse(response.getBody());

        } catch (Exception e) {
            log.error("Groq text API call failed: {}", e.getMessage());
            return "I'm sorry, I'm experiencing technical difficulties. Please try again later.";
        }
    }

    /**
     * Send an image (Base64 encoded) with a text prompt to Groq Vision.
     */
    public String sendVisionPrompt(String systemPrompt, String userPrompt, byte[] imageBytes, String mimeType) {
        try {
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            String dataUrl = "data:" + mimeType + ";base64," + base64Image;

            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", visionModel);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 1024);

            ArrayNode messages = objectMapper.createArrayNode();

            ObjectNode systemMsg = objectMapper.createObjectNode();
            systemMsg.put("role", "system");
            systemMsg.put("content", systemPrompt);
            messages.add(systemMsg);

            ObjectNode userMsg = objectMapper.createObjectNode();
            userMsg.put("role", "user");

            ArrayNode contentArray = objectMapper.createArrayNode();

            // Add text content
            ObjectNode textContent = objectMapper.createObjectNode();
            textContent.put("type", "text");
            textContent.put("text", userPrompt);
            contentArray.add(textContent);

            // Add image content
            ObjectNode imageContent = objectMapper.createObjectNode();
            imageContent.put("type", "image_url");
            ObjectNode imageUrl = objectMapper.createObjectNode();
            imageUrl.put("url", dataUrl);
            imageContent.set("image_url", imageUrl);
            contentArray.add(imageContent);

            userMsg.set("content", contentArray);
            messages.add(userMsg);
            requestBody.set("messages", messages);

            HttpEntity<String> entity = new HttpEntity<>(
                    objectMapper.writeValueAsString(requestBody),
                    buildHeaders()
            );

            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl, HttpMethod.POST, entity, String.class
            );

            return parseTextResponse(response.getBody());

        } catch (Exception e) {
            log.error("Groq vision API call failed: {}", e.getMessage());
            return "Unable to analyze the image at this time. Please try again.";
        }
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        return headers;
    }

    private String parseTextResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        return root.path("choices")
                .path(0)
                .path("message")
                .path("content")
                .asText("No response received.");
    }
}
