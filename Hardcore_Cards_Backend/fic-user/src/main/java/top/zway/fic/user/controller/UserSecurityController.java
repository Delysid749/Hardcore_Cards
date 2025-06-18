package top.zway.fic.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import top.zway.fic.base.constant.RegexConstant;
import top.zway.fic.base.entity.DTO.RegisterUserDTO;
import top.zway.fic.base.result.R;
import top.zway.fic.user.rpc.RsaRpcService;
import top.zway.fic.user.service.UserSecurityService;
import top.zway.fic.web.exception.Jsr303Checker;
import top.zway.fic.web.holder.LoginUserHolder;
import top.zway.fic.base.constant.PojoValidConstants;
import javax.validation.Valid;

/**
 * 用户安全控制器
 * 处理用户注册、密码修改等安全相关操作
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
public class UserSecurityController {

    private final UserSecurityService userSecurityService;
    private final LoginUserHolder loginUserHolder;

    @Autowired(required = false)
    @Qualifier("rsaRpcService")
    private RsaRpcService rsaRpcService;

    /**
     * 新用户注册接口
     * 接收前端注册请求，进行用户注册处理
     *
     * @param registerUserDTO 注册用户数据传输对象，包含邮箱和密码
     * @param bindingResult 参数校验结果
     * @return 注册结果响应
     */
    @PostMapping("/register")
    public R registerNewUser(@Valid @RequestBody RegisterUserDTO registerUserDTO, BindingResult bindingResult) {
        // 校验请求参数格式是否正确
        Jsr303Checker.check(bindingResult);

        // 处理密码解密（RSA加密是可选的）
        String finalPassword = registerUserDTO.getPassword();
        
        // 检查是否提供了RSA UUID且不为空，并且RsaRpcService可用
        if (rsaRpcService != null && registerUserDTO.getRsaUuid() != null && !registerUserDTO.getRsaUuid().trim().isEmpty()) {
            // 如果提供了RSA UUID，则进行解密
            try {
                String decrypt = rsaRpcService.decrypt(registerUserDTO.getRsaUuid(), registerUserDTO.getPassword(), true);
                if (decrypt == null || decrypt.trim().isEmpty()) {
                    return R.failed("密码解密失败，请重新获取加密密钥");
                }
                finalPassword = decrypt;
            } catch (Exception e) {
                return R.failed("RSA解密服务异常，请稍后重试");
            }
        }
        // 如果没有提供RSA UUID或为空，则直接使用原始密码（兼容模式）

        // 调用业务层执行用户注册逻辑，使用最终确定的密码
        boolean success = userSecurityService.registerNewUser(registerUserDTO.getUsername(), finalPassword);

        // 根据注册结果返回相应响应
        return R.judge(success, "邮箱已存在");
    }

    @PutMapping("/password")
    public R updatePassword(@RequestParam("oldpw") String oldpw, @RequestParam("newpw") String newpw, @RequestParam("rsaUuid") String rsaUuid) {
        if (oldpw == null || newpw == null || rsaUuid == null) {
            return R.failed("参数不能为空");
        }
        newpw = rsaRpcService.decrypt(rsaUuid, newpw, false);
        oldpw = rsaRpcService.decrypt(rsaUuid, oldpw, true);
        if (newpw == null || oldpw == null) {
            return R.failed("解密失败");
        }
        if (newpw.length() < PojoValidConstants.PASSWORD_MIN_LEN || newpw.length() > PojoValidConstants.PASSWORD_MAX_LEN){
            return R.failed("密码长度应在6-50之间");
        }
        Long id = loginUserHolder.getCurrentUser().getId();
        boolean success = userSecurityService.updatePassword(oldpw, newpw, id);
        return R.judge(success,"旧密码不正确");
    }

    @PutMapping("/password/reset")
    public R resetPassword(@Valid @RequestBody RegisterUserDTO registerUserDTO, BindingResult bindingResult) {
        Jsr303Checker.check(bindingResult);
        String decrypt = rsaRpcService.decrypt(registerUserDTO.getRsaUuid(), registerUserDTO.getPassword(), true);
        if (decrypt == null) {
            return R.failed("解密失败");
        }
        boolean success = userSecurityService.resetPassword(registerUserDTO.getUsername(), decrypt);
        return R.judge(success,"邮箱未注册");
    }

    @PutMapping("/email")
    public R updateEmail(String email){
        // XXX 更换邮箱验证码 这里暂不实现
        boolean match = RegexConstant.EMAIL_REGEX.asPredicate().test(email);
        if (!match){
            return R.failed("邮箱格式不正确");
        }
        Long id = loginUserHolder.getCurrentUser().getId();
        boolean success = userSecurityService.updateEmail(email, id);
        return R.judge(success,"修改失败");
    }

}
