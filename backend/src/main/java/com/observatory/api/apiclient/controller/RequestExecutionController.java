package com.observatory.api.apiclient.controller;

import com.observatory.api.apiclient.dto.ExecuteRequestDto;
import com.observatory.api.apiclient.dto.ExecutionResultDto;
import com.observatory.api.apiclient.service.RequestExecutionService;
import com.observatory.api.auth.entity.User;
import com.observatory.api.shared.domain.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/requests")
@RequiredArgsConstructor
@Tag(name = "Request Execution", description = "Endpoints for executing live HTTP requests")
public class RequestExecutionController {

    private final RequestExecutionService executionService;

    @PostMapping("/execute")
    @Operation(summary = "Execute an ad-hoc or saved API request")
    public ResponseEntity<ApiResponse<ExecutionResultDto>> executeRequest(
            @RequestBody ExecuteRequestDto requestDto,
            @AuthenticationPrincipal User user
    ) {
        ExecutionResultDto result = executionService.execute(requestDto, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Request executed successfully", result));
    }
}
