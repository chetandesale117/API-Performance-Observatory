package com.observatory.api.apiclient.dto;

import java.time.Instant;
import java.util.UUID;

public record RequestHistoryDto(
        UUID id,
        UUID requestId,
        UUID userId,
        String httpMethod,
        String url,
        String requestBody,
        String requestHeaders,
        Integer responseStatus,
        String responseBody,
        String responseHeaders,
        Long responseTimeMs,
        Long responseSizeBytes,
        Instant executedAt
) {}
