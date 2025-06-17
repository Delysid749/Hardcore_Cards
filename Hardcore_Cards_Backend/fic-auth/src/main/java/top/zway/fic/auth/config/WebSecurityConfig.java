package top.zway.fic.auth.config;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.boot.actuate.autoconfigure.security.servlet.EndpointRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Spring Security Web安全配置类
 *
 * 主要功能：
 * 1. 配置HTTP请求的安全访问策略，定义哪些接口需要认证，哪些可以匿名访问
 * 2. 提供密码编码器Bean，用于密码的加密和验证
 * 3. 暴露认证管理器Bean，供OAuth2认证服务器使用
 * 4. 提供JSON序列化工具Bean
 *
 * 在OAuth2认证体系中的作用：
 * - 与OAuth2ServerConfig配合工作，OAuth2ServerConfig负责token的生成和管理
 * - 此类负责基础的HTTP安全策略和认证组件的提供
 * - 两者共同构成完整的认证授权框架
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    /**
     * 配置HTTP安全策略
     *
     * 核心原理：
     * 定义系统中哪些URL路径需要认证，哪些可以匿名访问
     * 这对于OAuth2认证服务器来说非常重要，因为：
     * 1. OAuth2的认证端点本身不能被保护，否则会形成循环依赖
     * 2. 系统的公共接口（如公钥获取、健康检查）需要开放访问
     * 3. 业务接口需要通过OAuth2 token进行保护
     *
     * @param http HTTP安全配置对象
     * @throws Exception 配置异常
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                // 放行健康端点接口 - Spring Boot Actuator提供的监控端点
                // 用途：系统健康检查、指标监控等，监控系统需要无认证访问
                .requestMatchers(EndpointRequest.toAnyEndpoint()).permitAll()

                // 放行公钥接口 - RSA加密体系的公钥获取端点
                // 用途：前端需要获取公钥来加密敏感数据（如密码）后再传输
                .antMatchers("/rsa/publicKey").permitAll()
                .antMatchers("/oauth/rsa").permitAll()

                // 放行RPC解密接口 - 微服务间通信的解密服务
                // 用途：其他微服务调用此服务进行数据解密，内部服务间通信
                .antMatchers("/rpc/rsa/decrypt").permitAll()

                // 放行reCAPTCHA验证接口 - Google reCAPTCHA人机验证
                // 用途：注册、登录等场景的防机器人验证，前端需要直接访问
                .antMatchers("/rpc/recaptcha/verify").permitAll()

                // 其他所有请求都需要通过认证
                // 原理：除了上述白名单接口外，所有API都需要提供有效的OAuth2 token
                .anyRequest().authenticated()
                .and()
                // 关闭CSRF保护
                // 原因：使用JWT token进行无状态认证，不需要CSRF保护机制
                .csrf().disable();
    }

    /**
     * 认证管理器Bean
     *
     * 作用：
     * 1. Spring Security的核心认证组件，负责执行用户身份验证
     * 2. OAuth2ServerConfig需要使用此Bean来处理用户登录验证
     * 3. 协调各种认证提供者（AuthenticationProvider）完成认证流程
     *
     * 在OAuth2流程中的位置：
     * 用户登录 → OAuth2框架调用AuthenticationManager → 验证用户名密码 → 生成token
     *
     * @return 认证管理器实例
     * @throws Exception 配置异常
     */
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    /**
     * 密码编码器Bean
     *
     * 功能：
     * 1. 使用BCrypt算法对密码进行不可逆加密
     * 2. 验证用户输入的明文密码与数据库中存储的加密密码是否匹配
     *
     * BCrypt算法特点：
     * - 每次加密同一个密码会产生不同的hash值（因为salt随机）
     * - 加密强度高，计算复杂度大，抵抗暴力破解
     * - 自适应算法，可以根据硬件性能调整加密轮数
     *
     * @return BCrypt密码编码器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Jackson JSON对象映射器Bean
     *
     * 用途：
     * 1. 处理JSON数据的序列化和反序列化
     * 2. 在控制器中自动转换JSON请求体和响应体
     * 3. 其他组件可能需要手动进行JSON处理时使用
     *
     * 注意：这里使用的是老版本的Jackson (org.codehaus.jackson)
     * 现代Spring Boot通常使用com.fasterxml.jackson，但保持原项目的依赖
     *
     * @return Jackson ObjectMapper实例
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

}