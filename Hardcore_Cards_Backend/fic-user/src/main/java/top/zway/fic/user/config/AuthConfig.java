package top.zway.fic.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
/**
 * 认证相关配置类
 * 配置密码加密等安全相关组件
 */
@Configuration
public class AuthConfig {
    /**
     * 配置密码加密器
     * 使用BCrypt算法对用户密码进行单向加密
     * BCrypt是一种安全的哈希算法，每次加密结果都不同，但验证时能正确匹配
     * 
     * @return BCrypt密码加密器实例
     */
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
