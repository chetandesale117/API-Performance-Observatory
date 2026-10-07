package com.observatory.api.apiclient.dto;

import com.observatory.api.apiclient.entity.enums.AuthType;
import com.observatory.api.apiclient.entity.enums.BodyType;
import com.observatory.api.apiclient.entity.enums.HttpMethod;

import java.util.Map;
import java.util.UUID;

public record ExecuteRequestDto(
        UUID requestId,
        HttpMethod httpMethod,
        String url,
        String body,
        BodyType bodyType,
        AuthType authType,
        String authConfig,
        Map<String, String> headers,
        Map<String, String> parameters
) {}
