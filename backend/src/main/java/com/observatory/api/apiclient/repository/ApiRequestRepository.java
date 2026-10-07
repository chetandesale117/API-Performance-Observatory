package com.observatory.api.apiclient.repository;

import com.observatory.api.apiclient.entity.ApiRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApiRequestRepository extends JpaRepository<ApiRequest, UUID> {
    List<ApiRequest> findByCollectionIdOrderBySortOrder(UUID collectionId);
    List<ApiRequest> findByFolderIdOrderBySortOrder(UUID folderId);
}
