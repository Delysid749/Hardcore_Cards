package top.zway.fic.gateway.authorization;

import cn.hutool.core.convert.Convert;
import cn.hutool.core.util.StrUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.authorization.ReactiveAuthorizationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.server.authorization.AuthorizationContext;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import reactor.core.publisher.Mono;
import top.zway.fic.base.constant.AuthConstant;
import top.zway.fic.base.constant.RedisConstant;
import top.zway.fic.gateway.config.IgnoreUrlsConfig;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 权限管理器
 * 
 * 功能说明：
 * 1. 首先检查请求URL是否在白名单中，如果是则直接放行
 * 2. 否则从Redis中获取当前路径可访问角色列表进行权限验证
 * 3. 认证通过且角色匹配的用户可访问当前路径
 */
@Component
public class AuthorizationManager implements ReactiveAuthorizationManager<AuthorizationContext> {
    @Autowired
    private RedisTemplate<String,Object> redisTemplate;
    
    @Autowired
    private IgnoreUrlsConfig ignoreUrlsConfig;
    
    private AntPathMatcher antPathMatcher = new AntPathMatcher();

    @Override
    public Mono<AuthorizationDecision> check(Mono<Authentication> mono, AuthorizationContext authorizationContext) {
        URI uri = authorizationContext.getExchange().getRequest().getURI();
        String path = uri.getPath();
        
        // 检查是否在白名单中，如果在白名单中则直接放行
        if (ignoreUrlsConfig.getUrls() != null) {
            for (String ignoreUrl : ignoreUrlsConfig.getUrls()) {
                if (antPathMatcher.match(ignoreUrl, path)) {
                    // 在白名单中，直接放行
                    return Mono.just(new AuthorizationDecision(true));
                }
            }
        }
        
        // 不在白名单中，进行权限检查
        // 从Redis中获取当前路径可访问角色列表
        Object obj = redisTemplate.opsForHash().get(RedisConstant.RESOURCE_ROLES_MAP, path);
        List<String> authorities = Convert.toList(String.class, obj);
        
        // 如果Redis中没有该路径的权限配置，默认需要认证
        if (authorities == null || authorities.isEmpty()) {
            return mono
                    .filter(Authentication::isAuthenticated)
                    .map(auth -> new AuthorizationDecision(true))
                    .defaultIfEmpty(new AuthorizationDecision(false));
        }
        
        // 添加权限前缀
        authorities = authorities.stream()
                .map(i -> AuthConstant.AUTHORITY_PREFIX + i)
                .collect(Collectors.toList());
        
        // 认证通过且角色匹配的用户可访问当前路径
        return mono
                .filter(Authentication::isAuthenticated)
                .flatMapIterable(Authentication::getAuthorities)
                .map(GrantedAuthority::getAuthority)
                .any(authorities::contains)
                .map(AuthorizationDecision::new)
                .defaultIfEmpty(new AuthorizationDecision(false));
    }
}