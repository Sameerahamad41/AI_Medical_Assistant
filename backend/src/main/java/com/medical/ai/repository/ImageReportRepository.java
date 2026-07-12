package com.medical.ai.repository;

import com.medical.ai.entity.ImageReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageReportRepository extends JpaRepository<ImageReport, Long> {
    List<ImageReport> findByUserIdOrderByTimestampDesc(Long userId);
    long countByUserId(Long userId);
}
