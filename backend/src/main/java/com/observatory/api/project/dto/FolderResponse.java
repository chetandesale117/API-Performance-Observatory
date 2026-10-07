package com.observatory.api.project.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record FolderResponse(
        UUID id,
        String name,
        UUID collectionId,
        UUID parentFolderId,
        List<FolderResponse> childFolders,
        int requestCount,
        Instant createdAt
) {}
