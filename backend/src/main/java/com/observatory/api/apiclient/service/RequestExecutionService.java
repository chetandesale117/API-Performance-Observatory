package com.observatory.api.apiclient.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.observatory.api.apiclient.dto.ExecuteRequestDto;
import com.observatory.api.apiclient.dto.ExecutionResultDto;
import com.observatory.api.apiclient.entity.RequestHistory;
import com.observatory.api.apiclient.repository.RequestHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RequestExecutionService {

    private final RequestHistoryRepository historyRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    @Transactional
    public ExecutionResultDto execute(ExecuteRequestDto requestDto, UUID userId) {
        long startTime = System.currentTimeMillis();

        try {
            // Build URL with parameters
            String targetUrl = requestDto.url();
            if (requestDto.parameters() != null && !requestDto.parameters().isEmpty()) {
                UriComponentsBuilder uriBuilder = UriComponentsBuilder.fromHttpUrl(targetUrl);
                requestDto.parameters().forEach(uriBuilder::queryParam);
                targetUrl = uriBuilder.build().toUriString();
            }

            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create(targetUrl))
                    .timeout(Duration.ofSeconds(30));

            // Set Headers
            Map<String, String> requestHeaders = new HashMap<>();
            if (requestDto.headers() != null) {
                requestDto.headers().forEach((k, v) -> {
                    if (k != null && !k.isBlank() && v != null) {
                        builder.header(k, v);
                        requestHeaders.put(k, v);
                    }
                });
            }

            // Auth config
            if (requestDto.authType() != null) {
                switch (requestDto.authType()) {
                    case BEARER -> {
                        if (requestDto.authConfig() != null && !requestDto.authConfig().isBlank()) {
                            String headerVal = "Bearer " + requestDto.authConfig();
                            builder.header("Authorization", headerVal);
                            requestHeaders.put("Authorization", headerVal);
                        }
                    }
                    case BASIC -> {
                        if (requestDto.authConfig() != null && !requestDto.authConfig().isBlank()) {
                            String encoded = Base64.getEncoder().encodeToString(requestDto.authConfig().getBytes());
                            String headerVal = "Basic " + encoded;
                            builder.header("Authorization", headerVal);
                            requestHeaders.put("Authorization", headerVal);
                        }
                    }
                    case API_KEY -> {
                        if (requestDto.authConfig() != null && !requestDto.authConfig().isBlank()) {
                            builder.header("X-API-Key", requestDto.authConfig());
                            requestHeaders.put("X-API-Key", requestDto.authConfig());
                        }
                    }
                    default -> {}
                }
            }

            // HTTP Method and Body
            String method = requestDto.httpMethod() != null ? requestDto.httpMethod().name() : "GET";
            String bodyText = requestDto.body() != null ? requestDto.body() : "";

            if ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method) || "PATCH".equalsIgnoreCase(method)) {
                if (!requestHeaders.containsKey("Content-Type") && !requestHeaders.containsKey("content-type")) {
                    builder.header("Content-Type", "application/json");
                    requestHeaders.put("Content-Type", "application/json");
                }
                builder.method(method, HttpRequest.BodyPublishers.ofString(bodyText));
            } else if ("DELETE".equalsIgnoreCase(method)) {
                builder.method(method, bodyText.isBlank()
                        ? HttpRequest.BodyPublishers.noBody()
                        : HttpRequest.BodyPublishers.ofString(bodyText));
            } else {
                builder.method(method, HttpRequest.BodyPublishers.noBody());
            }

            HttpRequest httpRequest = builder.build();
            HttpResponse<String> httpResponse = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());

            long endTime = System.currentTimeMillis();
            long responseTimeMs = endTime - startTime;

            String responseBody = httpResponse.body() != null ? httpResponse.body() : "";
            long responseSizeBytes = responseBody.getBytes().length;

            Map<String, List<String>> responseHeadersMap = httpResponse.headers().map();

            ExecutionResultDto result = new ExecutionResultDto(
                    httpResponse.statusCode(),
                    getStatusText(httpResponse.statusCode()),
                    responseBody,
                    responseHeadersMap,
                    responseTimeMs,
                    responseSizeBytes
            );

            saveHistory(requestDto, userId, method, targetUrl, bodyText, requestHeaders, result);

            return result;

        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            long responseTimeMs = endTime - startTime;

            ExecutionResultDto errorResult = new ExecutionResultDto(
                    500,
                    "Error: " + e.getMessage(),
                    "{\"error\": \"" + e.getMessage() + "\"}",
                    Map.of(),
                    responseTimeMs,
                    0L
            );

            saveHistory(requestDto, userId,
                    requestDto.httpMethod() != null ? requestDto.httpMethod().name() : "GET",
                    requestDto.url(),
                    requestDto.body(),
                    requestDto.headers() != null ? requestDto.headers() : Map.of(),
                    errorResult
            );

            return errorResult;
        }
    }

    private void saveHistory(ExecuteRequestDto req, UUID userId, String method, String url, String reqBody, Map<String, String> reqHeaders, ExecutionResultDto res) {
        try {
            RequestHistory history = new RequestHistory();
            history.setRequestId(req.requestId());
            history.setUserId(userId);
            history.setHttpMethod(method);
            history.setUrl(url);
            history.setRequestBody(reqBody);
            history.setRequestHeaders(objectMapper.writeValueAsString(reqHeaders));
            history.setResponseStatus(res.statusCode());
            history.setResponseBody(res.responseBody());
            history.setResponseHeaders(objectMapper.writeValueAsString(res.responseHeaders()));
            history.setResponseTimeMs(res.responseTimeMs());
            history.setResponseSizeBytes(res.responseSizeBytes());
            history.setExecutedAt(Instant.now());

            historyRepository.save(history);
        } catch (Exception ignored) {
        }
    }

    private String getStatusText(int code) {
        return switch (code) {
            case 200 -> "OK";
            case 201 -> "Created";
            case 202 -> "Accepted";
            case 204 -> "No Content";
            case 400 -> "Bad Request";
            case 401 -> "Unauthorized";
            case 403 -> "Forbidden";
            case 404 -> "Not Found";
            case 405 -> "Method Not Allowed";
            case 500 -> "Internal Server Error";
            case 502 -> "Bad Gateway";
            case 503 -> "Service Unavailable";
            default -> "HTTP " + code;
        };
    }
}
