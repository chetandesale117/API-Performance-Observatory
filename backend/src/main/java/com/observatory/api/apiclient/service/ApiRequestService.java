package com.observatory.api.apiclient.service;

import com.observatory.api.apiclient.dto.*;
import com.observatory.api.apiclient.entity.ApiHeader;
import com.observatory.api.apiclient.entity.ApiParameter;
import com.observatory.api.apiclient.entity.ApiRequest;
import com.observatory.api.apiclient.repository.ApiHeaderRepository;
import com.observatory.api.apiclient.repository.ApiParameterRepository;
import com.observatory.api.apiclient.repository.ApiRequestRepository;
import com.observatory.api.project.entity.Collection;
import com.observatory.api.project.entity.Folder;
import com.observatory.api.project.repository.FolderRepository;
import com.observatory.api.project.service.CollectionService;
import com.observatory.api.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApiRequestService {

    private final ApiRequestRepository apiRequestRepository;
    private final ApiHeaderRepository apiHeaderRepository;
    private final ApiParameterRepository apiParameterRepository;
    private final CollectionService collectionService;
    private final FolderRepository folderRepository;

    @Transactional(readOnly = true)
    public ApiRequestResponse getRequestById(UUID id, UUID userId) {
        ApiRequest request = getRequestAndValidateOwner(id, userId);
        return toResponse(request);
    }

    @Transactional(readOnly = true)
    public List<ApiRequestResponse> getRequestsByCollection(UUID collectionId, UUID userId) {
        collectionService.getCollectionAndValidateOwner(collectionId, userId);
        return apiRequestRepository.findByCollectionIdOrderBySortOrder(collectionId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ApiRequestResponse createRequest(ApiRequestDto dto, UUID userId) {
        Collection collection = collectionService.getCollectionAndValidateOwner(dto.collectionId(), userId);

        ApiRequest request = new ApiRequest();
        request.setCollection(collection);
        request.setName(dto.name());
        request.setHttpMethod(dto.httpMethod());
        request.setUrl(dto.url() != null ? dto.url() : "");
        request.setBody(dto.body());
        request.setBodyType(dto.bodyType() != null ? dto.bodyType() : com.observatory.api.apiclient.entity.enums.BodyType.NONE);
        request.setAuthType(dto.authType() != null ? dto.authType() : com.observatory.api.apiclient.entity.enums.AuthType.NONE);
        request.setAuthConfig(dto.authConfig());

        if (dto.folderId() != null) {
            Folder folder = folderRepository.findById(dto.folderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Folder", "id", dto.folderId()));
            request.setFolder(folder);
        }

        ApiRequest saved = apiRequestRepository.save(request);

        saveHeadersAndParams(saved, dto.headers(), dto.parameters());

        return toResponse(saved);
    }

    @Transactional
    public ApiRequestResponse updateRequest(UUID id, ApiRequestDto dto, UUID userId) {
        ApiRequest request = getRequestAndValidateOwner(id, userId);

        request.setName(dto.name());
        request.setHttpMethod(dto.httpMethod());
        request.setUrl(dto.url() != null ? dto.url() : "");
        request.setBody(dto.body());
        if (dto.bodyType() != null) request.setBodyType(dto.bodyType());
        if (dto.authType() != null) request.setAuthType(dto.authType());
        request.setAuthConfig(dto.authConfig());

        if (dto.folderId() != null) {
            Folder folder = folderRepository.findById(dto.folderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Folder", "id", dto.folderId()));
            request.setFolder(folder);
        } else {
            request.setFolder(null);
        }

        // Clear existing headers/params and re-save
        apiHeaderRepository.deleteByRequestId(request.getId());
        apiParameterRepository.deleteByRequestId(request.getId());
        request.getHeaders().clear();
        request.getParameters().clear();

        saveHeadersAndParams(request, dto.headers(), dto.parameters());

        ApiRequest updated = apiRequestRepository.save(request);
        return toResponse(updated);
    }

    @Transactional
    public void deleteRequest(UUID id, UUID userId) {
        ApiRequest request = getRequestAndValidateOwner(id, userId);
        apiRequestRepository.delete(request);
    }

    @Transactional
    public ApiRequestResponse duplicateRequest(UUID id, UUID userId) {
        ApiRequest source = getRequestAndValidateOwner(id, userId);

        ApiRequest copy = new ApiRequest();
        copy.setCollection(source.getCollection());
        copy.setFolder(source.getFolder());
        copy.setName("Copy of " + source.getName());
        copy.setHttpMethod(source.getHttpMethod());
        copy.setUrl(source.getUrl());
        copy.setBody(source.getBody());
        copy.setBodyType(source.getBodyType());
        copy.setAuthType(source.getAuthType());
        copy.setAuthConfig(source.getAuthConfig());

        ApiRequest saved = apiRequestRepository.save(copy);

        for (ApiHeader h : source.getHeaders()) {
            ApiHeader newH = new ApiHeader();
            newH.setRequest(saved);
            newH.setHeaderKey(h.getHeaderKey());
            newH.setHeaderValue(h.getHeaderValue());
            newH.setActive(h.isActive());
            saved.getHeaders().add(newH);
        }

        for (ApiParameter p : source.getParameters()) {
            ApiParameter newP = new ApiParameter();
            newP.setRequest(saved);
            newP.setParamKey(p.getParamKey());
            newP.setParamValue(p.getParamValue());
            newP.setActive(p.isActive());
            saved.getParameters().add(newP);
        }

        ApiRequest duplicated = apiRequestRepository.save(saved);
        return toResponse(duplicated);
    }

    public ApiRequest getRequestAndValidateOwner(UUID requestId, UUID userId) {
        ApiRequest request = apiRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("API Request", "id", requestId));
        collectionService.getCollectionAndValidateOwner(request.getCollection().getId(), userId);
        return request;
    }

    private void saveHeadersAndParams(ApiRequest request, List<HeaderDto> headers, List<ParameterDto> parameters) {
        if (headers != null) {
            for (HeaderDto h : headers) {
                if (h.key() != null && !h.key().isBlank()) {
                    ApiHeader header = new ApiHeader();
                    header.setRequest(request);
                    header.setHeaderKey(h.key());
                    header.setHeaderValue(h.value() != null ? h.value() : "");
                    header.setActive(h.isActive());
                    request.getHeaders().add(header);
                }
            }
        }

        if (parameters != null) {
            for (ParameterDto p : parameters) {
                if (p.key() != null && !p.key().isBlank()) {
                    ApiParameter param = new ApiParameter();
                    param.setRequest(request);
                    param.setParamKey(p.key());
                    param.setParamValue(p.value() != null ? p.value() : "");
                    param.setActive(p.isActive());
                    request.getParameters().add(param);
                }
            }
        }
    }

    private ApiRequestResponse toResponse(ApiRequest req) {
        List<HeaderDto> headerDtos = req.getHeaders().stream()
                .map(h -> new HeaderDto(h.getId(), h.getHeaderKey(), h.getHeaderValue(), h.isActive()))
                .toList();

        List<ParameterDto> paramDtos = req.getParameters().stream()
                .map(p -> new ParameterDto(p.getId(), p.getParamKey(), p.getParamValue(), p.isActive()))
                .toList();

        return new ApiRequestResponse(
                req.getId(),
                req.getName(),
                req.getHttpMethod(),
                req.getUrl(),
                req.getBody(),
                req.getBodyType(),
                req.getAuthType(),
                req.getAuthConfig(),
                req.getCollection().getId(),
                req.getFolder() != null ? req.getFolder().getId() : null,
                headerDtos,
                paramDtos,
                req.getCreatedAt(),
                req.getUpdatedAt()
        );
    }
}
