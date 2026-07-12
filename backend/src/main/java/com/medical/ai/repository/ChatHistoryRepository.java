package com.medical.ai.repository;

import com.medical.ai.entity.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserIdOrderByTimestampDesc(Long userId);
    List<ChatHistory> findByUserIdAndCategoryOrderByTimestampDesc(Long userId, String category);
    long countByUserId(Long userId);
}
