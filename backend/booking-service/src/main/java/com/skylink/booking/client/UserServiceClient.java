package com.skylink.booking.client;

import com.skylink.booking.dto.response.ApiResponse;
import com.skylink.booking.dto.response.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/api/v1/users/{id}")
    ApiResponse<UserProfileResponse> getUserById(@PathVariable Long id);

}