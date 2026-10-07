package com.observatory.api.project.service;

import com.observatory.api.apiclient.entity.ApiRequest;
import com.observatory.api.project.dto.*;
import com.observatory.api.project.entity.Collection;
import com.observatory.api.project.entity.Folder;
import com.observatory.api.project.entity.Project;
import com.observatory.api.project.repository.CollectionRepository;
import com.observatory.api.project.repository.FolderRepository;
import com.observatory.api.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final ProjectService projectService;
    private final FolderRepository folderRepository;

    @Transactional(readOnly = true)
    public List<CollectionResponse> getCollectionsByProject(UUID projectId, UUID userId) {
        projectService.getProjectAndValidateOwner(projectId, userId);
        return collectionRepository.findByProjectIdOrderBySortOrder(projectId)
                .stream()
                .map(this::toCollectionResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CollectionTreeResponse getCollectionTree(UUID collectionId, UUID userId) {
        Collection collection = getCollectionAndValidateOwner(collectionId, userId);

        List<Folder> rootFolders = folderRepository.findByCollectionIdAndParentFolderIdIsNullOrderBySortOrder(collectionId);
        List<CollectionTreeResponse.FolderTreeNode> folderNodes = rootFolders.stream()
                .map(this::buildFolderTreeNode)
                .toList();

        List<CollectionTreeResponse.ApiRequestSummary> rootRequests = collection.getApiRequests().stream()
                .filter(req -> req.getFolder() == null)
                .map(this::toRequestSummary)
                .toList();

        return new CollectionTreeResponse(
                collection.getId(),
                collection.getName(),
                collection.getDescription(),
                folderNodes,
                rootRequests
        );
    }

    @Transactional
    public CollectionResponse createCollection(UUID projectId, CollectionRequest request, UUID userId) {
        Project project = projectService.getProjectAndValidateOwner(projectId, userId);

        Collection collection = new Collection();
        collection.setProject(project);
        collection.setName(request.name());
        collection.setDescription(request.description());

        Collection saved = collectionRepository.save(collection);
        return toCollectionResponse(saved);
    }

    @Transactional
    public CollectionResponse updateCollection(UUID id, CollectionRequest request, UUID userId) {
        Collection collection = getCollectionAndValidateOwner(id, userId);
        collection.setName(request.name());
        collection.setDescription(request.description());

        Collection updated = collectionRepository.save(collection);
        return toCollectionResponse(updated);
    }

    @Transactional
    public void deleteCollection(UUID id, UUID userId) {
        Collection collection = getCollectionAndValidateOwner(id, userId);
        collectionRepository.delete(collection);
    }

    public Collection getCollectionAndValidateOwner(UUID collectionId, UUID userId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Collection", "id", collectionId));
        projectService.getProjectAndValidateOwner(collection.getProject().getId(), userId);
        return collection;
    }

    private CollectionResponse toCollectionResponse(Collection c) {
        return new CollectionResponse(
                c.getId(),
                c.getName(),
                c.getDescription(),
                c.getProject().getId(),
                c.getApiRequests() != null ? c.getApiRequests().size() : 0,
                c.getFolders() != null ? c.getFolders().size() : 0,
                c.getCreatedAt()
        );
    }

    private CollectionTreeResponse.FolderTreeNode buildFolderTreeNode(Folder folder) {
        List<CollectionTreeResponse.FolderTreeNode> childNodes = folder.getChildFolders().stream()
                .map(this::buildFolderTreeNode)
                .toList();

        List<CollectionTreeResponse.ApiRequestSummary> requestSummaries = folder.getApiRequests().stream()
                .map(this::toRequestSummary)
                .toList();

        return new CollectionTreeResponse.FolderTreeNode(
                folder.getId(),
                folder.getName(),
                childNodes,
                requestSummaries
        );
    }

    private CollectionTreeResponse.ApiRequestSummary toRequestSummary(ApiRequest req) {
        return new CollectionTreeResponse.ApiRequestSummary(
                req.getId(),
                req.getName(),
                req.getHttpMethod().name(),
                req.getUrl()
        );
    }
}
