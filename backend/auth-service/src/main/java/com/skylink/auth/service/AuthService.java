package com.skylink.auth.service;

import com.skylink.auth.dto.request.LoginRequest;
import com.skylink.auth.dto.request.RegisterRequest;
import com.skylink.auth.dto.response.ApiResponse;
import com.skylink.auth.dto.response.LoginResponse;

public interface AuthService {

    ApiResponse<String> register(RegisterRequest request);

    ApiResponse<LoginResponse> login(LoginRequest request);

}