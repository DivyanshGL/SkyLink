package com.skylink.auth.service.impl;

import com.skylink.auth.dto.request.LoginRequest;
import com.skylink.auth.dto.request.RegisterRequest;
import com.skylink.auth.dto.response.ApiResponse;
import com.skylink.auth.dto.response.LoginResponse;
import com.skylink.auth.entity.Role;
import com.skylink.auth.entity.User;
import com.skylink.auth.exception.EmailAlreadyExistsException;
import com.skylink.auth.repository.UserRepository;
import com.skylink.auth.security.JwtService;
import com.skylink.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public ApiResponse<String> register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return ApiResponse.<String>builder()
                .success(true)
                .message("User registered successfully")
                .data(user.getEmail())
                .build();
    }

    @Override
    public ApiResponse<LoginResponse> login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user.getEmail());

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();

        return ApiResponse.<LoginResponse>builder()
                .success(true)
                .message("Login successful")
                .data(response)
                .build();
    }
}