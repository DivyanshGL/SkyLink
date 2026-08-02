package com.skylink.booking.feign.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReleaseSeatRequest {

    private Integer seats;
}
