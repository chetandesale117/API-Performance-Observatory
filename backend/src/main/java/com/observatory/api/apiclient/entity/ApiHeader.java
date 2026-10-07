package com.observatory.api.apiclient.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "api_headers")
public class ApiHeader {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false)
    private ApiRequest request;

    @Column(name = "header_key", nullable = false)
    private String headerKey;

    @Column(name = "header_value", nullable = false, columnDefinition = "TEXT")
    private String headerValue = "";

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}
