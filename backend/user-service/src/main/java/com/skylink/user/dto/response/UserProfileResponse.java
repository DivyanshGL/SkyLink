package com.skylink.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String gender;

    private String address;

    private String city;

    private String state;

    private String country;

    private String pincode;

    private boolean active;
}