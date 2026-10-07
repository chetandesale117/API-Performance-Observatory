package com.observatory.api.project.repository;

import com.observatory.api.project.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CollectionRepository extends JpaRepository<Collection, UUID> {
    List<Collection> findByProjectIdOrderBySortOrder(UUID projectId);
}
