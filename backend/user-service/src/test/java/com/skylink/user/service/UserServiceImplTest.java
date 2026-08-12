package com.skylink.user.service;

import com.skylink.user.dto.request.CreateUserProfileRequest;
import com.skylink.user.dto.request.UpdateProfileRequest;
import com.skylink.user.dto.response.ApiResponse;
import com.skylink.user.dto.response.UserProfileResponse;
import com.skylink.user.entity.UserProfile;
import com.skylink.user.exception.UserNotFoundException;
import com.skylink.user.repository.UserProfileRepository;
import com.skylink.user.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @InjectMocks
    private UserServiceImpl userService;

    private UserProfile userProfile;

    @BeforeEach
    void setUp() {
        userProfile = UserProfile.builder()
                .id(1L)
                .fullName("John Doe")
                .email("john@example.com")
                .phone("1234567890")
                .active(true)
                .build();
    }

    @Test
    void getProfile_Success() {
        when(userProfileRepository.findById(anyLong())).thenReturn(Optional.of(userProfile));

        ApiResponse<UserProfileResponse> response = userService.getProfile(1L);

        assertTrue(response.isSuccess());
        assertEquals("User profile fetched successfully", response.getMessage());
        assertEquals("John Doe", response.getData().getFullName());
    }

    @Test
    void getProfile_UserNotFound() {
        when(userProfileRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(UserNotFoundException.class, () -> userService.getProfile(1L));
    }

    @Test
    void updateProfile_Success() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setFullName("Jane Doe");
        request.setPhone("0987654321");

        when(userProfileRepository.findById(anyLong())).thenReturn(Optional.of(userProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(i -> i.getArguments()[0]);

        ApiResponse<UserProfileResponse> response = userService.updateProfile(1L, request);

        assertTrue(response.isSuccess());
        assertEquals("Jane Doe", response.getData().getFullName());
        assertEquals("0987654321", response.getData().getPhone());
    }

    @Test
    void getAllUsers_Success() {
        when(userProfileRepository.findAll()).thenReturn(List.of(userProfile));

        ApiResponse<List<UserProfileResponse>> response = userService.getAllUsers();

        assertTrue(response.isSuccess());
        assertEquals(1, response.getData().size());
        assertEquals("John Doe", response.getData().get(0).getFullName());
    }

    @Test
    void deactivateUser_Success() {
        when(userProfileRepository.findById(anyLong())).thenReturn(Optional.of(userProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        ApiResponse<String> response = userService.deactivateUser(1L);

        assertTrue(response.isSuccess());
        assertFalse(userProfile.isActive());
    }

    @Test
    void activateUser_Success() {
        userProfile.setActive(false);
        when(userProfileRepository.findById(anyLong())).thenReturn(Optional.of(userProfile));
        when(userProfileRepository.save(any(UserProfile.class))).thenReturn(userProfile);

        ApiResponse<String> response = userService.activateUser(1L);

        assertTrue(response.isSuccess());
        assertTrue(userProfile.isActive());
    }

    @Test
    void createProfile_Success() {
        CreateUserProfileRequest request = CreateUserProfileRequest.builder()
                .id(2L)
                .fullName("Alice")
                .email("alice@example.com")
                .phone("1112223334")
                .build();

        when(userProfileRepository.save(any(UserProfile.class))).thenAnswer(i -> i.getArguments()[0]);

        ApiResponse<UserProfileResponse> response = userService.createProfile(request);

        assertTrue(response.isSuccess());
        assertEquals("Alice", response.getData().getFullName());
        assertEquals(2L, response.getData().getId());
    }
}
