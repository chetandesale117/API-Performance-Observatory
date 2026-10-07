package com.observatory.api.project.controller;

import com.observatory.api.auth.entity.User;
import com.observatory.api.project.dto.FolderRequest;
import com.observatory.api.project.dto.FolderResponse;
import com.observatory.api.project.service.FolderService;
import com.observatory.api.shared.domain.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Folders", description = "Endpoints for managing folders within collections")
public class FolderController {

    private final FolderService folderService;

    @PostMapping("/collections/{collectionId}/folders")
    @Operation(summary = "Create a folder inside a collection")
    public ResponseEntity<ApiResponse<FolderResponse>> createFolder(
            @PathVariable UUID collectionId,
            @Valid @RequestBody FolderRequest request,
            @AuthenticationPrincipal User user
    ) {
        FolderResponse response = folderService.createFolder(collectionId, request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Folder created successfully", response));
    }

    @PutMapping("/folders/{id}")
    @Operation(summary = "Update folder")
    public ResponseEntity<ApiResponse<FolderResponse>> updateFolder(
            @PathVariable UUID id,
            @Valid @RequestBody FolderRequest request,
            @AuthenticationPrincipal User user
    ) {
        FolderResponse response = folderService.updateFolder(id, request, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Folder updated successfully", response));
    }

    @DeleteMapping("/folders/{id}")
    @Operation(summary = "Delete folder")
    public ResponseEntity<ApiResponse<Void>> deleteFolder(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        folderService.deleteFolder(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Folder deleted successfully", null));
    }
}
