package com.observatory.api.project.dto;

import java.time.Instant;
import java.util.UUID;

public record ProjectResponse(
        UUID id,
        String name,
        String description,
        UUID ownerId,
        int collectionCount,
        Instant createdAt,
        Instant updatedAt
) {}
