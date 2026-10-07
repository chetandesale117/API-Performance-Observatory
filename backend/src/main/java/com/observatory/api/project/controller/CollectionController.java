package com.observatory.api.project.controller;

import com.observatory.api.auth.entity.User;
import com.observatory.api.project.dto.CollectionRequest;
import com.observatory.api.project.dto.CollectionResponse;
import com.observatory.api.project.dto.CollectionTreeResponse;
import com.observatory.api.project.service.CollectionService;
import com.observatory.api.shared.domain.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Collections", description = "Endpoints for managing API collections")
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping("/projects/{projectId}/collections")
    @Operation(summary = "List collections in a project")
    public ResponseEntity<ApiResponse<List<CollectionResponse>>> getCollections(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user
    ) {
        List<CollectionResponse> collections = collectionService.getCollectionsByProject(projectId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(collections));
    }

    @PostMapping("/projects/{projectId}/collections")
    @Operation(summary = "Create a collection in a project")
    public ResponseEntity<ApiResponse<CollectionResponse>> createCollection(
            @PathVariable UUID projectId,
            @Valid @RequestBody CollectionRequest request,
            @AuthenticationPrincipal User user
    ) {
        CollectionResponse response = collectionService.createCollection(projectId, request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Collection created successfully", response));
    }

    @GetMapping("/collections/{id}")
    @Operation(summary = "Get collection hierarchy tree (folders and requests)")
    public ResponseEntity<ApiResponse<CollectionTreeResponse>> getCollectionTree(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        CollectionTreeResponse tree = collectionService.getCollectionTree(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(tree));
    }

    @PutMapping("/collections/{id}")
    @Operation(summary = "Update collection")
    public ResponseEntity<ApiResponse<CollectionResponse>> updateCollection(
            @PathVariable UUID id,
            @Valid @RequestBody CollectionRequest request,
            @AuthenticationPrincipal User user
    ) {
        CollectionResponse response = collectionService.updateCollection(id, request, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Collection updated successfully", response));
    }

    @DeleteMapping("/collections/{id}")
    @Operation(summary = "Delete collection")
    public ResponseEntity<ApiResponse<Void>> deleteCollection(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        collectionService.deleteCollection(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Collection deleted successfully", null));
    }
}
