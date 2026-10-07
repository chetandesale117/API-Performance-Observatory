package com.observatory.api.apiclient.service;

import com.observatory.api.apiclient.dto.RequestHistoryDto;
import com.observatory.api.apiclient.entity.RequestHistory;
import com.observatory.api.apiclient.repository.RequestHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RequestHistoryService {

    private final RequestHistoryRepository historyRepository;

    @Transactional(readOnly = true)
    public Page<RequestHistoryDto> getHistoryForUser(UUID userId, Pageable pageable) {
        return historyRepository.findByUserIdOrderByExecutedAtDesc(userId, pageable)
                .map(this::toDto);
    }

    @Transactional(readOnly = true)
    public Page<RequestHistoryDto> getHistoryForRequest(UUID requestId, Pageable pageable) {
        return historyRepository.findByRequestIdOrderByExecutedAtDesc(requestId, pageable)
                .map(this::toDto);
    }

    private RequestHistoryDto toDto(RequestHistory h) {
        return new RequestHistoryDto(
                h.getId(),
                h.getRequestId(),
                h.getUserId(),
                h.getHttpMethod(),
                h.getUrl(),
                h.getRequestBody(),
                h.getRequestHeaders(),
                h.getResponseStatus(),
                h.getResponseBody(),
                h.getResponseHeaders(),
                h.getResponseTimeMs(),
                h.getResponseSizeBytes(),
                h.getExecutedAt()
        );
    }
}
