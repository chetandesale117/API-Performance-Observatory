package com.observatory.api.apiclient.dto;

import com.observatory.api.apiclient.entity.enums.AuthType;
import com.observatory.api.apiclient.entity.enums.BodyType;
import com.observatory.api.apiclient.entity.enums.HttpMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record ApiRequestDto(
        @NotBlank(message = "Request name is required")
        String name,
        @NotNull(message = "HTTP method is required")
        HttpMethod httpMethod,
        String url,
        String body,
        BodyType bodyType,
        AuthType authType,
        String authConfig,
        @NotNull(message = "Collection ID is required")
        UUID collectionId,
        UUID folderId,
        List<HeaderDto> headers,
        List<ParameterDto> parameters
) {}
