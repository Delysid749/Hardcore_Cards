package top.zway.fic.auth.config;


import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.security.oauth2.provider.token.TokenEnhancerChain;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.KeyStoreKeyFactory;
import top.zway.fic.auth.service.impl.UserServiceImpl;
import top.zway.fic.base.constant.AuthConstant;

import java.security.KeyPair;
import java.util.ArrayList;
import java.util.List;

/**
 * OAuth2 认证服务器配置类
 *
 * 核心功能：
 * 1. 配置 OAuth2.0 认证服务器，提供标准的 OAuth2 认证服务
 * 2. 集成 JWT Token 机制，实现无状态的分布式认证
 * 3. 配置客户端信息，定义哪些应用可以访问认证服务
 * 4. 配置认证端点，定义 Token 生成和验证的详细规则
 * 5. 集成自定义用户加载服务，连接业务用户数据
 *
 * OAuth2 认证流程：
 * 1. 前端应用作为 OAuth2 客户端，向认证服务器请求访问令牌
 * 2. 用户提供用户名密码，认证服务器验证用户身份（通过 UserServiceImpl）
 * 3. 验证成功后，生成 JWT 格式的 Access Token 和 Refresh Token
 * 4. 客户端使用 Access Token 访问受保护的资源
 * 5. Access Token 过期时，使用 Refresh Token 获取新的 Access Token
 *
 * JWT Token 优势：
 * - 无状态：服务器不需要存储 Session，易于横向扩展
 * - 自包含：Token 中包含用户信息，减少数据库查询
 * - 安全：使用非对称加密签名，防止 Token 被伪造
 * - 标准：遵循 RFC7519 标准，与各种系统兼容
 *
 * 架构位置：
 * - 作为独立的认证服务（端口 4011），为整个微服务架构提供统一认证
 * - 网关服务通过此服务验证 Token 的有效性
 * - 业务服务通过 Token 获取当前用户信息
 *
 * @author Ethan Yao
 * @since 1.0.0
 */
@RequiredArgsConstructor
@Configuration
@EnableAuthorizationServer
public class Oauth2ServerConfig extends AuthorizationServerConfigurerAdapter {
    /**
     * 密码编码器
     * 用于加密客户端密钥，确保配置文件中的密钥安全存储
     */
    private final PasswordEncoder passwordEncoder;
    /**
     * 用户详情服务
     * 实现了 UserDetailsService 接口，负责从数据库加载用户信息
     * 在 OAuth2 认证流程中，当验证用户名密码时会调用此服务
     */
    private final UserServiceImpl userDetailsService;

    /**
     * 认证管理器
     * Spring Security 的核心组件，负责执行实际的认证逻辑
     * 协调 UserDetailsService 和 PasswordEncoder 完成用户验证
     */
    private final AuthenticationManager authenticationManager;

    /**
     * JWT Token 增强器
     * 自定义 Token 内容，可以在 JWT 中添加额外的用户信息
     * 例如：用户ID、角色、权限等，避免每次都查询数据库
     */
    private final JwtTokenEnhancer jwtTokenEnhancer;

    /**
     * 配置 OAuth2 客户端详情
     *
     * 原理：
     * OAuth2 协议要求客户端（前端应用）必须先注册到认证服务器
     * 注册信息包括：客户端ID、密钥、授权范围、支持的授权类型等
     *
     * 授权类型说明：
     * - password：资源所有者密码凭据授权（用户直接提供用户名密码）
     * - refresh_token：刷新令牌授权（使用 Refresh Token 获取新的 Access Token）
     *
     * Token 有效期设置：
     * - Access Token：短期有效（通常 2 小时），用于日常 API 访问
     * - Refresh Token：长期有效（通常 7 天），用于 Access Token 过期时的自动刷新
     *
     * @param clients 客户端详情配置器
     * @throws Exception 配置异常
     */
    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()  // 使用内存存储客户端信息（生产环境可考虑使用数据库）
                .withClient("fic")  // 客户端 ID，前端应用的唯一标识
                .secret(passwordEncoder.encode("fic"))  // 客户端密钥，加密后存储
                .scopes("all")  // 授权范围，这里设置为 all，表示可以访问所有资源
                .authorizedGrantTypes("password", "refresh_token")  // 支持的授权类型
                .accessTokenValiditySeconds(AuthConstant.ACCESS_TOKEN_VALIDITY_SECONDS)  // Access Token 有效期
                .refreshTokenValiditySeconds(AuthConstant.REFRESH_TOKEN_VALIDITY_SECONDS); // Refresh Token 有效期
    }

    /**
     * 配置认证服务器端点
     *
     * 原理：
     * 定义 OAuth2 认证服务器的核心行为，包括：
     * 1. 如何验证用户身份（通过 AuthenticationManager）
     * 2. 如何加载用户详情（通过 UserDetailsService）
     * 3. 如何生成和解析 Token（通过 TokenConverter 和 TokenEnhancer）
     *
     * Token 增强链：
     * 1. JwtTokenEnhancer：添加自定义信息到 Token 中
     * 2. JwtAccessTokenConverter：将 Token 转换为 JWT 格式并签名
     *
     * JWT 签名机制：
     * - 使用非对称密钥对（RSA）进行签名
     * - 私钥用于签名（只有认证服务器拥有）
     * - 公钥用于验证（其他服务可以获取）
     * - 确保 Token 不可伪造，同时支持分布式验证
     *
     * @param endpoints 端点配置器
     */
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        // 创建 Token 增强链
        TokenEnhancerChain enhancerChain = new TokenEnhancerChain();
        List<TokenEnhancer> delegates = new ArrayList<>();

        // 1. 添加自定义 Token 增强器（添加额外信息）
        delegates.add(jwtTokenEnhancer);
        // 2. 添加 JWT 访问令牌转换器（JWT 格式化和签名）
        delegates.add(accessTokenConverter());

        // 配置 JWT 的内容增强器链
        enhancerChain.setTokenEnhancers(delegates);

        // 配置认证端点
        endpoints.authenticationManager(authenticationManager)  // 设置认证管理器
                .userDetailsService(userDetailsService)  // 配置加载用户信息的服务
                .accessTokenConverter(accessTokenConverter())  // 配置 JWT 转换器
                .tokenEnhancer(enhancerChain);  // 配置 Token 增强链
    }

    /**
     * 配置认证服务器安全设置
     *
     * 原理：
     * OAuth2 提供了多种客户端认证方式：
     * 1. HTTP Basic 认证：在请求头中传递 client_id 和 client_secret
     * 2. 表单认证：在请求体中传递 client_id 和 client_secret
     *
     * allowFormAuthenticationForClients() 的作用：
     * - 允许客户端通过表单参数进行认证
     * - 前端可以直接在请求体中包含 client_id 和 client_secret
     * - 简化了前端的实现复杂度
     *
     * 安全考虑：
     * - 仅在内部系统或受信任的客户端中使用
     * - 生产环境建议使用更安全的认证方式
     */
    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) {
        // 让 /oauth/token 端点支持 client_id 以及 client_secret 作为表单参数进行登录认证
        security.allowFormAuthenticationForClients();
    }

    /**
     * JWT 访问令牌转换器
     *
     * 功能：
     * 1. 将普通的 OAuth2 Token 转换为 JWT 格式
     * 2. 使用非对称密钥对 JWT 进行签名
     * 3. 提供 JWT 的解析和验证功能
     *
     * JWT 结构：
     * - Header：包含算法信息和令牌类型
     * - Payload：包含用户信息和过期时间等声明
     * - Signature：使用私钥对 Header 和 Payload 的签名
     *
     * 签名验证流程：
     * 1. 其他服务接收到 JWT Token
     * 2. 使用公钥验证签名的有效性
     * 3. 解析 Payload 获取用户信息
     * 4. 检查 Token 是否过期
     *
     * @return JWT 访问令牌转换器实例
     */
    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        JwtAccessTokenConverter jwtAccessTokenConverter = new JwtAccessTokenConverter();
        // 设置用于 JWT 签名的密钥对
        jwtAccessTokenConverter.setKeyPair(keyPair());
        return jwtAccessTokenConverter;
    }

    /**
     * JWT 签名密钥对
     *
     * 原理：
     * 1. 从 Java KeyStore (JKS) 文件中加载预生成的 RSA 密钥对
     * 2. JKS 文件是 Java 标准的密钥存储格式，安全性较高
     * 3. 私钥用于签名 JWT Token，公钥用于验证签名
     *
     * 文件位置：
     * - jwt.jks 位于 src/main/resources 目录下
     * - 密钥库密码和私钥密码都是 "123456"（生产环境应使用强密码）
     *
     * 安全建议：
     * 1. 生产环境应使用更强的密码
     * 2. 定期轮换密钥对
     * 3. 将 JKS 文件存储在安全的位置
     * 4. 考虑使用 HSM（硬件安全模块）存储密钥
     *
     * 密钥对生成命令（如需重新生成）：
     * keytool -genkeypair -alias jwt -keyalg RSA -keypass 123456 -keystore jwt.jks -storepass 123456
     *
     * @return RSA 密钥对实例
     */
    @Bean
    public KeyPair keyPair() {
        // 从 classpath 下的证书中获取密钥对
        KeyStoreKeyFactory keyStoreKeyFactory = new KeyStoreKeyFactory(
                new ClassPathResource("jwt.jks"),  // JKS 文件路径
                "123456".toCharArray()  // 密钥库密码
        );
        return keyStoreKeyFactory.getKeyPair(
                "jwt",  // 密钥别名
                "123456".toCharArray()  // 私钥密码
        );
    }
}
