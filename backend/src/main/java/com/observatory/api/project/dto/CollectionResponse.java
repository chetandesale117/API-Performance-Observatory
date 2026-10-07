package com.observatory.api.project.dto;

import java.time.Instant;
import java.util.UUID;

public record CollectionResponse(
        UUID id,
        String name,
        String description,
        UUID projectId,
        int requestCount,
        int folderCount,
        Instant createdAt
) {}
