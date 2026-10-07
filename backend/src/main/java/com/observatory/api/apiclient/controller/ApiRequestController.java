package com.observatory.api.apiclient.controller;

import com.observatory.api.apiclient.dto.*;
import com.observatory.api.apiclient.service.ApiRequestService;
import com.observatory.api.apiclient.service.RequestHistoryService;
import com.observatory.api.auth.entity.User;
import com.observatory.api.shared.domain.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
@Tag(name = "API Requests", description = "Endpoints for creating, managing, and duplicating API requests")
public class ApiRequestController {

    private final ApiRequestService apiRequestService;
    private final RequestHistoryService historyService;

    @PostMapping
    @Operation(summary = "Create a new API request")
    public ResponseEntity<ApiResponse<ApiRequestResponse>> createRequest(
            @Valid @RequestBody ApiRequestDto dto,
            @AuthenticationPrincipal User user
    ) {
        ApiRequestResponse response = apiRequestService.createRequest(dto, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("API Request created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get API request by ID")
    public ResponseEntity<ApiResponse<ApiRequestResponse>> getRequest(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        ApiRequestResponse response = apiRequestService.getRequestById(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update API request")
    public ResponseEntity<ApiResponse<ApiRequestResponse>> updateRequest(
            @PathVariable UUID id,
            @Valid @RequestBody ApiRequestDto dto,
            @AuthenticationPrincipal User user
    ) {
        ApiRequestResponse response = apiRequestService.updateRequest(id, dto, user.getId());
        return ResponseEntity.ok(ApiResponse.success("API Request updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete API request")
    public ResponseEntity<ApiResponse<Void>> deleteRequest(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        apiRequestService.deleteRequest(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("API Request deleted successfully", null));
    }

    @PostMapping("/{id}/duplicate")
    @Operation(summary = "Duplicate an existing API request")
    public ResponseEntity<ApiResponse<ApiRequestResponse>> duplicateRequest(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user
    ) {
        ApiRequestResponse response = apiRequestService.duplicateRequest(id, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("API Request duplicated successfully", response));
    }

    @GetMapping("/collection/{collectionId}")
    @Operation(summary = "List all API requests in a collection")
    public ResponseEntity<ApiResponse<List<ApiRequestResponse>>> getRequestsByCollection(
            @PathVariable UUID collectionId,
            @AuthenticationPrincipal User user
    ) {
        List<ApiRequestResponse> requests = apiRequestService.getRequestsByCollection(collectionId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(requests));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get execution history for an API request")
    public ResponseEntity<ApiResponse<Page<RequestHistoryDto>>> getRequestHistory(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<RequestHistoryDto> history = historyService.getHistoryForRequest(id, pageable);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
