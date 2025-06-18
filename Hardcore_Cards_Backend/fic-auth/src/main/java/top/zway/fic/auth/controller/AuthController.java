package top.zway.fic.auth.controller;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.endpoint.TokenEndpoint;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.zway.fic.auth.service.AsymmetricEncryptionService;
import top.zway.fic.auth.service.ReCaptchaVerificationService;
import top.zway.fic.base.constant.AuthConstant;
import top.zway.fic.base.result.R;

import java.security.Principal;
import java.util.Map;
/**
 * OAuth2 认证控制器
 *
 * 核心功能：
 * 1. 自定义OAuth2 token获取端点，增强标准OAuth2功能
 * 2. 集成reCAPTCHA验证，防止机器人攻击
 * 3. 集成RSA加密，确保密码传输安全
 * 4. 提供统一的认证结果封装
 *
 * 认证流程：
 * 1. 前端提交加密密码和验证码token
 * 2. 验证reCAPTCHA验证码的有效性
 * 3. 使用RSA私钥解密密码
 * 4. 调用标准OAuth2端点获取访问令牌
 * 5. 返回封装后的认证结果
 *
 * 安全机制：
 * - reCAPTCHA防机器人：防止暴力破解攻击
 * - RSA加密传输：确保密码在网络传输中的安全性
 * - 临时密钥：RSA私钥用后即删，避免密钥泄露
 */
@RestController
@RequestMapping
@AllArgsConstructor
@Slf4j
public class AuthController {
    /**
     * OAuth2标准token端点
     * Spring Security OAuth2提供的标准令牌获取端点
     */
    private final TokenEndpoint tokenEndpoint;

    private final ReCaptchaVerificationService reCaptchaVerificationService;
    /**
     * 非对称加密服务
     * 用于RSA密钥对的生成、管理和密码解密
     */
    private final AsymmetricEncryptionService asymmetricEncryptionService;

    /**
     * 自定义OAuth2 token获取端点
     *
     * 功能增强：
     * 1. 在标准OAuth2流程基础上增加安全验证
     * 2. 验证reCAPTCHA防机器人攻击
     * 3. RSA解密密码确保传输安全
     * 4. 统一结果封装便于前端处理
     *
     * 参数说明：
     * - principal: OAuth2客户端认证信息
     * - parameters: 包含grant_type、username、password等OAuth2标准参数
     *   以及captcha_code、rsa_uuid等自定义安全参数
     *
     * 安全流程：
     * 1. 检查授权类型是否为密码模式
     * 2. 验证reCAPTCHA token有效性
     * 3. 使用RSA UUID解密前端加密的密码
     * 4. 将解密后的明文密码传递给OAuth2标准流程
     * 5. 获取访问令牌和刷新令牌
     *
     * @param principal OAuth2客户端主体信息
     * @param parameters 请求参数Map，包含OAuth2标准参数和自定义安全参数
     * @return 统一结果封装，包含OAuth2AccessToken或错误信息
     * @throws HttpRequestMethodNotSupportedException HTTP方法不支持异常
     */
    @PostMapping("/oauth/token")
    public R postAccessToken(Principal principal,@RequestParam Map<String,String> parameters) throws HttpRequestMethodNotSupportedException{
        // 检查是否为密码授权模式，只有密码模式才需要额外的安全验证
        if(AuthConstant.GRANT_TYPE_PASSWORD.equals(parameters.get(AuthConstant.GRANT_TYPE))){
            // Step 1: reCAPTCHA验证码校验
            // 获取前端提交的验证码token
            String captchaCode = parameters.get(AuthConstant.CAPTCHA_CODE_KEY);
            if(captchaCode == null){
                return R.failed("先输入验证码");
            }
            // 调用Google reCAPTCHA服务验证token有效性
            if (!reCaptchaVerificationService.verify(captchaCode)) {
                return R.failed("验证失败");
            }

            // Step 2: RSA密码解密
            // 获取RSA密钥UUID和加密密码
            String rsaUuid = parameters.get(AuthConstant.RSA_UUID_KEY);
            String password = parameters.get(AuthConstant.PASSWORD_KEY);
            if(rsaUuid == null || password == null){
                return R.failed("密码不能为空");
            }
//            使用RSA私钥解密前端加密的密码
            String decryptPassword = asymmetricEncryptionService.decrypt(rsaUuid,password,true);
            if(decryptPassword == null){
                return R.failed("密码解析错误");
            }
            // 将解密后的明文密码替换原加密密码，供OAuth2标准流程使用
            parameters.put(AuthConstant.PASSWORD_KEY,decryptPassword);
        }
        // Step 3: 调用标准OAuth2 token端点
        // 传递经过安全验证和处理的参数给OAuth2标准流程
        OAuth2AccessToken accessToken = tokenEndpoint.postAccessToken(principal,parameters).getBody();

        // Step 4: 返回统一封装的结果
        return R.success(accessToken);
    }

    /**
     * 热部署测试接口
     * 
     * 用途：验证Spring Boot DevTools热部署功能是否正常工作
     * 使用方法：
     * 1. 启动认证服务
     * 2. 访问: GET http://localhost:4011/oauth/hotdeploy-test
     * 3. 修改返回消息，按Ctrl+F9编译
     * 4. 再次访问，查看消息是否更新
     * 
     * @return 测试消息
     */
    @GetMapping("/oauth/hotdeploy-test")
    public R<String> hotDeployTest() {
        log.info("热部署测试接口被调用");
        return R.success("🚀 热部署测试成功！当前时间: " + java.time.LocalDateTime.now() + " - 版本1.0");
    }

}
