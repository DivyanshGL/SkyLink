package com.skylink.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    private String gender;

    private String address;

    private String city;

    private String state;

    private String country;

    @Size(min = 6, max = 6, message = "Pincode must be exactly 6 characters")
    private String pincode;
}