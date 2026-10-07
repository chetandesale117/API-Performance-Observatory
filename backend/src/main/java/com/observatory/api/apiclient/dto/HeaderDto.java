package com.observatory.api.apiclient.dto;

import java.util.UUID;

public record HeaderDto(
        UUID id,
        String key,
        String value,
        boolean isActive
) {
    public HeaderDto(String key, String value) {
        this(null, key, value, true);
    }
}
