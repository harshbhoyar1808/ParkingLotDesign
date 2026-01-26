// Optional: explicit bean registration if component scanning does not include the package
// java/com/harsh/pratice/parkinlotdesign/config/AppConfig.java
package com.harsh.pratice.parkinglotdesign.config;

import com.harsh.pratice.parkinglotdesign.service.ParkingLotDesignService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public ParkingLotDesignService parkingLotDesignService() {
        return new ParkingLotDesignService();
    }
}
