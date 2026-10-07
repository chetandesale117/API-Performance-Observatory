package com.observatory.api.project.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record FolderRequest(
        @NotBlank(message = "Folder name is required")
        String name,
        UUID parentFolderId
) {}
