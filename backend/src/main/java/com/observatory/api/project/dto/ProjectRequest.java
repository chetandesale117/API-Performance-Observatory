package com.observatory.api.project.dto;

import jakarta.validation.constraints.NotBlank;

public record ProjectRequest(
        @NotBlank(message = "Project name is required")
        String name,
        String description
) {}
