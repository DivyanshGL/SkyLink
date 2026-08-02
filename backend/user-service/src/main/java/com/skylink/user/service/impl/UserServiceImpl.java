package com.skylink.user.service.impl;

import com.skylink.user.dto.request.UpdateProfileRequest;
import com.skylink.user.dto.response.ApiResponse;
import com.skylink.user.dto.response.UserProfileResponse;
import com.skylink.user.entity.UserProfile;
import com.skylink.user.exception.UserNotFoundException;
import com.skylink.user.repository.UserProfileRepository;
import com.skylink.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserProfileRepository userProfileRepository;

    @Override
    public ApiResponse<UserProfileResponse> getProfile(Long id) {

        UserProfile user = userProfileRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + id));

        UserProfileResponse response = mapToResponse(user);

        return ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .message("User profile fetched successfully")
                .data(response)
                .build();
    }

    @Override
    public ApiResponse<UserProfileResponse> updateProfile(
            Long id,
            UpdateProfileRequest request) {

        UserProfile user = userProfileRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + id));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setCountry(request.getCountry());
        user.setPincode(request.getPincode());

        UserProfile updatedUser = userProfileRepository.save(user);

        return ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .message("Profile updated successfully")
                .data(mapToResponse(updatedUser))
                .build();
    }

    @Override
    public ApiResponse<List<UserProfileResponse>> getAllUsers() {

        List<UserProfileResponse> users = userProfileRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ApiResponse.<List<UserProfileResponse>>builder()
                .success(true)
                .message("Users fetched successfully")
                .data(users)
                .build();
    }

    @Override
    public ApiResponse<String> deactivateUser(Long id) {

        UserProfile user = userProfileRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + id));

        user.setActive(false);

        userProfileRepository.save(user);

        return ApiResponse.<String>builder()
                .success(true)
                .message("User deactivated successfully")
                .data("User deactivated")
                .build();
    }

    private UserProfileResponse mapToResponse(UserProfile user) {

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .gender(user.getGender())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .country(user.getCountry())
                .pincode(user.getPincode())
                .active(user.isActive())
                .build();
    }
}