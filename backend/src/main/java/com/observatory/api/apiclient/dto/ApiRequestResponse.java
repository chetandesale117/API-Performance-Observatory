package com.observatory.api.apiclient.dto;

import com.observatory.api.apiclient.entity.enums.AuthType;
import com.observatory.api.apiclient.entity.enums.BodyType;
import com.observatory.api.apiclient.entity.enums.HttpMethod;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ApiRequestResponse(
        UUID id,
        String name,
        HttpMethod httpMethod,
        String url,
        String body,
        BodyType bodyType,
        AuthType authType,
        String authConfig,
        UUID collectionId,
        UUID folderId,
        List<HeaderDto> headers,
        List<ParameterDto> parameters,
        Instant createdAt,
        Instant updatedAt
) {}
