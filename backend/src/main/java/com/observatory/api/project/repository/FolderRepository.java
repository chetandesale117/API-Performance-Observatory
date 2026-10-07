package com.observatory.api.project.repository;

import com.observatory.api.project.entity.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FolderRepository extends JpaRepository<Folder, UUID> {
    List<Folder> findByCollectionIdAndParentFolderIdIsNullOrderBySortOrder(UUID collectionId);
    List<Folder> findByParentFolderIdOrderBySortOrder(UUID parentFolderId);
}
