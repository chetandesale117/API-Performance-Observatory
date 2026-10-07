package com.observatory.api.auth.dto;

import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String firstName,
        String lastName,
        String role
) {}
