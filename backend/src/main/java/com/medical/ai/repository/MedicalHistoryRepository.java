package com.medical.ai.repository;

import com.medical.ai.entity.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {
    List<MedicalHistory> findByUserIdOrderByDiagnosisDateDesc(Long userId);
}
