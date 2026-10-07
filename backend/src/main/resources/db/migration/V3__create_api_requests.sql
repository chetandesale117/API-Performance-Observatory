CREATE TABLE api_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    http_method VARCHAR(20) NOT NULL DEFAULT 'GET',
    url TEXT NOT NULL DEFAULT '',
    body TEXT,
    body_type VARCHAR(20) NOT NULL DEFAULT 'NONE',
    auth_type VARCHAR(20) NOT NULL DEFAULT 'NONE',
    auth_config TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    version BIGINT NOT NULL DEFAULT 0
);

CREATE INDEX idx_api_requests_collection ON api_requests(collection_id);
CREATE INDEX idx_api_requests_folder ON api_requests(folder_id);

CREATE TABLE api_headers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES api_requests(id) ON DELETE CASCADE,
    header_key VARCHAR(255) NOT NULL,
    header_value TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_api_headers_request ON api_headers(request_id);

CREATE TABLE api_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES api_requests(id) ON DELETE CASCADE,
    param_key VARCHAR(255) NOT NULL,
    param_value TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_api_params_request ON api_parameters(request_id);

CREATE TABLE request_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES api_requests(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    http_method VARCHAR(20) NOT NULL,
    url TEXT NOT NULL,
    request_body TEXT,
    request_headers TEXT,
    response_status INT,
    response_body TEXT,
    response_headers TEXT,
    response_time_ms BIGINT,
    response_size_bytes BIGINT,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_request_history_request ON request_history(request_id);
CREATE INDEX idx_request_history_user ON request_history(user_id);
CREATE INDEX idx_request_history_executed ON request_history(executed_at DESC);
