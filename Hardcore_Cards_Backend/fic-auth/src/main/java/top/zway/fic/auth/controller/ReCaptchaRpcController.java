package top.zway.fic.auth.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.zway.fic.auth.service.ReCaptchaVerificationService;

/**
 * reCAPTCHA验证RPC控制器
 *
 * 主要功能：
 * 1. 为系统提供Google reCAPTCHA人机验证服务
 * 2. 支持RPC调用，其他微服务可以调用此接口进行验证码验证
 * 3. 防止机器人攻击，提高系统安全性
 *
 * reCAPTCHA工作原理：
 * 1. 前端集成Google reCAPTCHA组件
 * 2. 用户完成人机验证后，获得token
 * 3. 前端将token提交给后端
 * 4. 后端调用Google API验证token有效性
 * 5. 返回验证结果，决定是否允许用户操作
 *
 * 应用场景：
 * - 用户注册：防止批量注册虚假账户
 * - 用户登录：防止暴力破解攻击
 * - 敏感操作：防止恶意自动化操作
 * - 表单提交：防止垃圾信息提交
 *
 * 安全优势：
 * - Google AI算法：先进的机器学习算法识别机器人行为
 * - 无感体验：大多数正常用户无需额外操作
 * - 实时更新：Google持续更新反机器人策略
 * - 广泛采用：业界标准的人机验证解决方案
 */
@RestController
@AllArgsConstructor
@Slf4j
public class ReCaptchaRpcController {

    /**
     * reCAPTCHA验证服务
     * 负责与Google reCAPTCHA API通信，验证token有效性
     */
    private final ReCaptchaVerificationService reCaptchaVerificationService;

    /**
     * reCAPTCHA验证接口
     *
     * 验证流程：
     * 1. 接收前端提交的reCAPTCHA token
     * 2. 调用Google reCAPTCHA API进行验证
     * 3. 解析Google返回的验证结果
     * 4. 返回boolean值表示验证是否通过
     *
     * token说明：
     * - token是前端reCAPTCHA组件生成的一次性验证凭证
     * - 每个token只能使用一次，验证后即失效
     * - token有时效性，通常几分钟内有效
     * - token包含用户行为分析结果和时间戳等信息
     *
     * 返回值说明：
     * - true: 验证通过，用户是人类用户
     * - false: 验证失败，可能是机器人或验证码已过期
     *
     * 注意事项：
     * - 此接口可能被频繁调用，需要注意性能
     * - 网络异常可能影响验证结果，需要合理的超时设置
     * - 开发环境可能需要绕过验证，便于调试
     *
     * @param token Google reCAPTCHA返回的验证token
     * @return 验证结果，true表示通过，false表示失败
     */
    @PostMapping("/rpc/recaptcha/verify")
    public Boolean verify(@RequestParam("token") String token) {
        return reCaptchaVerificationService.verify(token);
    }
}