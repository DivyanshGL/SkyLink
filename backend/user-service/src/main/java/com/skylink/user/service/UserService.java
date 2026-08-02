package com.skylink.user.service;

import com.skylink.user.dto.request.UpdateProfileRequest;
import com.skylink.user.dto.response.ApiResponse;
import com.skylink.user.dto.response.UserProfileResponse;

import java.util.List;

public interface UserService {

    ApiResponse<UserProfileResponse> getProfile(Long id);

    ApiResponse<UserProfileResponse> updateProfile(
            Long id,
            UpdateProfileRequest request
    );

    ApiResponse<List<UserProfileResponse>> getAllUsers();

    ApiResponse<String> deactivateUser(Long id);
}