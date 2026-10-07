package com.observatory.api.apiclient.dto;

import java.util.List;
import java.util.Map;

public record ExecutionResultDto(
        int statusCode,
        String statusText,
        String responseBody,
        Map<String, List<String>> responseHeaders,
        long responseTimeMs,
        long responseSizeBytes
) {}
