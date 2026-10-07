package com.observatory.api.project.service;

import com.observatory.api.project.dto.FolderRequest;
import com.observatory.api.project.dto.FolderResponse;
import com.observatory.api.project.entity.Collection;
import com.observatory.api.project.entity.Folder;
import com.observatory.api.project.repository.FolderRepository;
import com.observatory.api.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FolderService {

    private final FolderRepository folderRepository;
    private final CollectionService collectionService;

    @Transactional
    public FolderResponse createFolder(UUID collectionId, FolderRequest request, UUID userId) {
        Collection collection = collectionService.getCollectionAndValidateOwner(collectionId, userId);

        Folder folder = new Folder();
        folder.setCollection(collection);
        folder.setName(request.name());

        if (request.parentFolderId() != null) {
            Folder parent = folderRepository.findById(request.parentFolderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent Folder", "id", request.parentFolderId()));
            folder.setParentFolder(parent);
        }

        Folder saved = folderRepository.save(folder);
        return toFolderResponse(saved);
    }

    @Transactional
    public FolderResponse updateFolder(UUID id, FolderRequest request, UUID userId) {
        Folder folder = getFolderAndValidateOwner(id, userId);
        folder.setName(request.name());

        Folder updated = folderRepository.save(folder);
        return toFolderResponse(updated);
    }

    @Transactional
    public void deleteFolder(UUID id, UUID userId) {
        Folder folder = getFolderAndValidateOwner(id, userId);
        folderRepository.delete(folder);
    }

    public Folder getFolderAndValidateOwner(UUID folderId, UUID userId) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new ResourceNotFoundException("Folder", "id", folderId));
        collectionService.getCollectionAndValidateOwner(folder.getCollection().getId(), userId);
        return folder;
    }

    private FolderResponse toFolderResponse(Folder folder) {
        List<FolderResponse> childResponses = folder.getChildFolders() != null
                ? folder.getChildFolders().stream().map(this::toFolderResponse).toList()
                : List.of();

        return new FolderResponse(
                folder.getId(),
                folder.getName(),
                folder.getCollection().getId(),
                folder.getParentFolder() != null ? folder.getParentFolder().getId() : null,
                childResponses,
                folder.getApiRequests() != null ? folder.getApiRequests().size() : 0,
                folder.getCreatedAt()
        );
    }
}
