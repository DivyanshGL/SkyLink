package com.skylink.user.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserProfileRequest {

    private Long id;
    private String fullName;
    private String email;
    private String phone;

}