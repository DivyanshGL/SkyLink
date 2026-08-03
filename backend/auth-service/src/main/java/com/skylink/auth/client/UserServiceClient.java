package com.skylink.auth.client;

import com.skylink.auth.dto.request.CreateUserProfileRequest;
import com.skylink.auth.dto.response.ApiResponse;
import com.skylink.auth.dto.response.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @PostMapping("/api/v1/users")
    ApiResponse<UserProfileResponse> createProfile(
            @RequestBody CreateUserProfileRequest request
    );
}