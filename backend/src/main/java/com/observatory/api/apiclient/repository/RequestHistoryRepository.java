package com.observatory.api.apiclient.repository;

import com.observatory.api.apiclient.entity.RequestHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RequestHistoryRepository extends JpaRepository<RequestHistory, UUID> {
    Page<RequestHistory> findByUserIdOrderByExecutedAtDesc(UUID userId, Pageable pageable);
    Page<RequestHistory> findByRequestIdOrderByExecutedAtDesc(UUID requestId, Pageable pageable);
}
