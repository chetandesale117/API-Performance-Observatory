package com.observatory.api.apiclient.repository;

import com.observatory.api.apiclient.entity.ApiParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ApiParameterRepository extends JpaRepository<ApiParameter, UUID> {
    void deleteByRequestId(UUID requestId);
}
