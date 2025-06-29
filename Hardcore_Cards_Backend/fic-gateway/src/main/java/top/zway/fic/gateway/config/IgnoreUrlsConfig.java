package top.zway.fic.gateway.config;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@EqualsAndHashCode
@Component
@ConfigurationProperties(prefix="secure.ignore")
@RefreshScope
public class IgnoreUrlsConfig {
    private List<String> urls;
}