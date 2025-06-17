package top.zway.fic.auth.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.common.exceptions.InvalidClientException;
import org.springframework.security.oauth2.common.exceptions.InvalidGrantException;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import top.zway.fic.base.result.R;
import top.zway.fic.base.result.ResultCode;

/**
 * 认证服务全局异常处理器
 *
 * 主要功能：
 * 1. 统一处理OAuth2认证过程中的各种异常
 * 2. 将技术异常转换为用户友好的错误信息
 * 3. 确保所有API返回统一的响应格式
 * 4. 提高系统安全性，避免敏感信息泄露
 *
 * 异常处理策略：
 * - 捕获Spring Security OAuth2框架抛出的各种异常
 * - 转换为业务层面的错误码和错误信息
 * - 记录详细的错误日志便于问题排查
 * - 返回标准化的JSON响应格式
 */
@RestControllerAdvice
@Slf4j
@Order(-1)  // 高优先级，优先处理认证相关异常
public class AuthExceptionHandler {

    /**
     * 处理用户名不存在异常
     *
     * 触发场景：用户输入不存在的用户名进行登录
     * 安全考虑：不区分用户名不存在和密码错误，统一返回认证失败
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(UsernameNotFoundException.class)
    public R handleUsernameNotFoundException(UsernameNotFoundException e) {
        log.warn("用户名不存在: {}", e.getMessage());
        return R.failed(ResultCode.USER_NOT_EXIST);
    }

    /**
     * 处理无效授权异常
     *
     * 触发场景：密码错误、授权类型不支持等
     * 常见原因：密码输入错误、grant_type参数错误
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(InvalidGrantException.class)
    public R handleInvalidGrantException(InvalidGrantException e) {
        log.warn("授权失败: {}", e.getMessage());
        return R.failed(ResultCode.USERNAME_OR_PASSWORD_ERROR);
    }

    /**
     * 处理无效客户端异常
     *
     * 触发场景：客户端ID或密钥错误
     * 常见原因：client_id或client_secret配置错误
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler(InvalidClientException.class)
    public R handleInvalidClientException(InvalidClientException e) {
        log.error("客户端认证失败: {}", e.getMessage());
        return R.failed(ResultCode.CLIENT_AUTHENTICATION_FAILED);
    }

    /**
     * 处理内部认证服务异常
     *
     * 触发场景：账户状态异常（禁用、锁定、过期）
     * 业务逻辑：UserServiceImpl中的状态检查抛出的异常
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler({InternalAuthenticationServiceException.class})
    public R handleInternalAuthenticationServiceException(InternalAuthenticationServiceException e) {
        log.warn("账户状态异常: {}", e.getMessage());
        return R.failed(e.getMessage());
    }

    /**
     * 处理无效Token异常
     *
     * 触发场景：JWT token过期、格式错误、签名验证失败
     * 应用场景：token验证、刷新token操作
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler({InvalidTokenException.class})
    public R handleInvalidTokenException(InvalidTokenException e) {
        log.warn("Token无效: {}", e.getMessage());
        return R.failed(e.getMessage());
    }

    /**
     * 兜底异常处理器
     *
     * 功能：捕获所有未被特定处理器处理的异常
     * 目的：确保系统不会因为未处理的异常而崩溃
     * 安全：避免向用户暴露系统内部错误信息
     */
    @ResponseStatus(HttpStatus.OK)
    @ExceptionHandler({Exception.class})
    public R handleBaseException(Exception e) {
        log.error("系统内部错误: {}", e.getMessage(), e);
        return R.failed("系统内部错误，请联系管理员");
    }
}