package com.observatory.api.apiclient.repository;

import com.observatory.api.apiclient.entity.ApiHeader;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ApiHeaderRepository extends JpaRepository<ApiHeader, UUID> {
    void deleteByRequestId(UUID requestId);
}
