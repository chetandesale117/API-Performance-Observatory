package com.observatory.api.project.dto;

import java.util.List;
import java.util.UUID;

public record CollectionTreeResponse(
        UUID id,
        String name,
        String description,
        List<FolderTreeNode> folders,
        List<ApiRequestSummary> requests
) {
    public record FolderTreeNode(
            UUID id,
            String name,
            List<FolderTreeNode> childFolders,
            List<ApiRequestSummary> requests
    ) {}

    public record ApiRequestSummary(
            UUID id,
            String name,
            String httpMethod,
            String url
    ) {}
}
