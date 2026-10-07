package com.observatory.api.apiclient.dto;

import java.util.UUID;

public record ParameterDto(
        UUID id,
        String key,
        String value,
        boolean isActive
) {
    public ParameterDto(String key, String value) {
        this(null, key, value, true);
    }
}
