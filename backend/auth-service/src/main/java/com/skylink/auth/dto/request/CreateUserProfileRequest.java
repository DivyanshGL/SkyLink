
package com.skylink.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserProfileRequest {

    @NotNull
    private Long id;

    @NotBlank
    private String fullName;

    @NotBlank
    @Email(message = "Please provide a valid email address")
    private String email;

    private String phone;
}