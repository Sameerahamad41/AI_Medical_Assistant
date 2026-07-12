package com.medical.ai.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.medical.ai.entity.User;
import com.medical.ai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final UserRepository userRepository;

    public byte[] generateReport(String email, List<String> symptoms, String aiAnalysis, String doctorAdvice) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Define fonts
            Font titleFont = new Font(Font.HELVETICA, 22, Font.BOLD, new Color(0, 102, 204));
            Font headerFont = new Font(Font.HELVETICA, 14, Font.BOLD, new Color(44, 62, 80));
            Font bodyFont = new Font(Font.HELVETICA, 11, Font.NORMAL, Color.DARK_GRAY);
            Font labelFont = new Font(Font.HELVETICA, 11, Font.BOLD, new Color(52, 73, 94));
            Font smallFont = new Font(Font.HELVETICA, 9, Font.ITALIC, Color.GRAY);

            // ---- Header ----
            Paragraph title = new Paragraph("AI Medical Assistant", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle = new Paragraph("Medical Consultation Report", headerFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingBefore(4);
            document.add(subtitle);

            // Divider
            document.add(new Chunk(new LineSeparator(1f, 100f, new Color(0, 102, 204), Element.ALIGN_CENTER, -2)));
            document.add(Chunk.NEWLINE);

            // ---- Patient Info ----
            Paragraph patientHeader = new Paragraph("Patient Information", headerFont);
            patientHeader.setSpacingBefore(10);
            document.add(patientHeader);

            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingBefore(8);
            infoTable.setSpacingAfter(8);

            addTableRow(infoTable, "Name:", user.getName(), labelFont, bodyFont);
            addTableRow(infoTable, "Email:", user.getEmail(), labelFont, bodyFont);
            addTableRow(infoTable, "Age:", user.getAge() != null ? user.getAge() + " years" : "N/A", labelFont, bodyFont);
            addTableRow(infoTable, "Blood Group:", user.getBloodGroup() != null ? user.getBloodGroup() : "N/A", labelFont, bodyFont);
            addTableRow(infoTable, "Report Date:", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")), labelFont, bodyFont);
            document.add(infoTable);

            document.add(new Chunk(new LineSeparator(0.5f, 100f, Color.LIGHT_GRAY, Element.ALIGN_CENTER, -2)));
            document.add(Chunk.NEWLINE);

            // ---- Symptoms ----
            Paragraph symptomsHeader = new Paragraph("Reported Symptoms", headerFont);
            symptomsHeader.setSpacingBefore(8);
            document.add(symptomsHeader);

            com.lowagie.text.List symptomList = new com.lowagie.text.List(com.lowagie.text.List.UNORDERED);
            symptomList.setIndentationLeft(20);
            for (String symptom : symptoms) {
                symptomList.add(new ListItem(symptom, bodyFont));
            }
            document.add(symptomList);
            document.add(Chunk.NEWLINE);

            // ---- AI Analysis ----
            Paragraph analysisHeader = new Paragraph("AI Analysis & Suggestions", headerFont);
            analysisHeader.setSpacingBefore(8);
            document.add(analysisHeader);

            Paragraph analysisContent = new Paragraph(aiAnalysis, bodyFont);
            analysisContent.setSpacingBefore(6);
            analysisContent.setLeading(16);
            document.add(analysisContent);
            document.add(Chunk.NEWLINE);

            // ---- Doctor Advice ----
            if (doctorAdvice != null && !doctorAdvice.isBlank()) {
                Paragraph adviceHeader = new Paragraph("Doctor / Additional Notes", headerFont);
                adviceHeader.setSpacingBefore(8);
                document.add(adviceHeader);

                Paragraph adviceContent = new Paragraph(doctorAdvice, bodyFont);
                adviceContent.setSpacingBefore(6);
                adviceContent.setLeading(16);
                document.add(adviceContent);
                document.add(Chunk.NEWLINE);
            }

            // ---- Disclaimer ----
            document.add(new Chunk(new LineSeparator(0.5f, 100f, Color.LIGHT_GRAY, Element.ALIGN_CENTER, -2)));
            Paragraph disclaimer = new Paragraph(
                    "⚠️ DISCLAIMER: This report is generated by an AI system and is intended for " +
                    "informational purposes only. It is NOT a substitute for professional medical advice, " +
                    "diagnosis, or treatment. Always consult a qualified healthcare professional.",
                    smallFont
            );
            disclaimer.setSpacingBefore(10);
            disclaimer.setAlignment(Element.ALIGN_CENTER);
            document.add(disclaimer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF report: " + e.getMessage(), e);
        }
    }

    private void addTableRow(PdfPTable table, String label, String value, Font labelFont, Font bodyFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        labelCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
        labelCell.setPadding(4);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, bodyFont));
        valueCell.setBorder(com.lowagie.text.Rectangle.NO_BORDER);
        valueCell.setPadding(4);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
