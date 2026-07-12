package com.medical.ai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "image_reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String imagePath;

    @Column(nullable = false)
    private String imageType; // SKIN, EYE, TONGUE, OTHER

    @Column(columnDefinition = "TEXT")
    private String aiAnalysis;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;
}
