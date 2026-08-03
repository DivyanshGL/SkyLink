package com.skylink.user.controller;

import com.skylink.user.dto.request.UpdateProfileRequest;
import com.skylink.user.dto.response.ApiResponse;
import com.skylink.user.dto.response.UserProfileResponse;
import com.skylink.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.skylink.user.dto.request.CreateUserProfileRequest;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ApiResponse<UserProfileResponse> createProfile(
            @RequestBody CreateUserProfileRequest request) {

        return userService.createProfile(request);
    }

    @GetMapping("/{id}")
    public ApiResponse<UserProfileResponse> getProfile(
            @PathVariable Long id) {

        return userService.getProfile(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<UserProfileResponse> updateProfile(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest request) {

        return userService.updateProfile(id, request);
    }

    @GetMapping
    public ApiResponse<List<UserProfileResponse>> getAllUsers() {

        return userService.getAllUsers();
    }

    @PatchMapping("/{id}/deactivate")
    public ApiResponse<String> deactivateUser(
            @PathVariable Long id) {

        return userService.deactivateUser(id);
    }



}