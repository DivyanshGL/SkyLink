package com.skylink.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skylink.user.dto.request.CreateUserProfileRequest;
import com.skylink.user.dto.request.UpdateProfileRequest;
import com.skylink.user.dto.response.ApiResponse;
import com.skylink.user.dto.response.UserProfileResponse;
import com.skylink.user.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    void createProfile_Success() throws Exception {
        CreateUserProfileRequest request = new CreateUserProfileRequest(1L, "John Doe", "john@example.com", "1234567890");
        UserProfileResponse response = new UserProfileResponse(1L, "John Doe", "john@example.com", "1234567890", null, null, null, null, null, null, true);

        ApiResponse<UserProfileResponse> apiResponse = ApiResponse.<UserProfileResponse>builder()
                .success(true)
                .message("User profile created successfully")
                .data(response)
                .build();

        when(userService.createProfile(any(CreateUserProfileRequest.class))).thenReturn(apiResponse);

        mockMvc.perform(post("/api/v1/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("John Doe"));
    }

    @Test
    void getProfile_Success() throws Exception {
        UserProfileResponse response = new UserProfileResponse(1L, "John Doe", "john@example.com", "1234567890", null, null, null, null, null, null, true);
        ApiResponse<UserProfileResponse> apiResponse = ApiResponse.<UserProfileResponse>builder().success(true).data(response).build();

        when(userService.getProfile(1L)).thenReturn(apiResponse);

        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("John Doe"));
    }

    @Test
    void updateProfile_Success() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest("Jane Doe", "0987654321", null, null, null, null, null, "123456");
        UserProfileResponse response = new UserProfileResponse(1L, "Jane Doe", "john@example.com", "0987654321", null, null, null, null, null, "123456", true);
        ApiResponse<UserProfileResponse> apiResponse = ApiResponse.<UserProfileResponse>builder().success(true).data(response).build();

        when(userService.updateProfile(anyLong(), any(UpdateProfileRequest.class))).thenReturn(apiResponse);

        mockMvc.perform(put("/api/v1/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Jane Doe"));
    }

    @Test
    void getAllUsers_Success() throws Exception {
        UserProfileResponse response = new UserProfileResponse(1L, "John Doe", "john@example.com", "1234567890", null, null, null, null, null, null, true);
        ApiResponse<List<UserProfileResponse>> apiResponse = ApiResponse.<List<UserProfileResponse>>builder().success(true).data(List.of(response)).build();

        when(userService.getAllUsers()).thenReturn(apiResponse);

        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].fullName").value("John Doe"));
    }

    @Test
    void deactivateUser_Success() throws Exception {
        ApiResponse<String> apiResponse = ApiResponse.<String>builder().success(true).data("User deactivated").build();

        when(userService.deactivateUser(1L)).thenReturn(apiResponse);

        mockMvc.perform(patch("/api/v1/users/1/deactivate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value("User deactivated"));
    }

    @Test
    void activateUser_Success() throws Exception {
        ApiResponse<String> apiResponse = ApiResponse.<String>builder().success(true).data("User activated").build();

        when(userService.activateUser(1L)).thenReturn(apiResponse);

        mockMvc.perform(patch("/api/v1/users/1/activate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value("User activated"));
    }
}
