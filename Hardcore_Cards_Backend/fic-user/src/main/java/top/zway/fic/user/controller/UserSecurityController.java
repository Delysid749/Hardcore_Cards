package top.zway.fic.user.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import top.zway.fic.base.entity.DTO.RegisterUserDTO;
import top.zway.fic.base.result.R;
import top.zway.fic.user.service.UserSecurityService;
import top.zway.fic.web.exception.Jsr303Checker;

import javax.validation.Valid;

/**
 * 用户安全控制器
 * 处理用户注册、密码修改等安全相关操作
 */
@RestController
@RequestMapping("/user")
@Api("用户账户密码api")
@RequiredArgsConstructor
public class UserSecurityController {

    private final UserSecurityService userSecurityService;

    /**
     * 新用户注册接口
     * 接收前端注册请求，进行用户注册处理
     *
     * @param registerUserDTO 注册用户数据传输对象，包含邮箱和密码
     * @param bindingResult 参数校验结果
     * @return 注册结果响应
     */
    @PostMapping("/register")
    @ApiOperation("新用户注册")
    public R registerNewUser(@Valid @RequestBody RegisterUserDTO registerUserDTO, BindingResult bindingResult) {
        // 校验请求参数格式是否正确
        Jsr303Checker.check(bindingResult);

        // 调用业务层执行用户注册逻辑
        boolean success = userSecurityService.registerNewUser(registerUserDTO.getUsername(), registerUserDTO.getPassword());

        // 根据注册结果返回相应响应
        return R.judge(success, "邮箱已存在");
    }

    /**
     * 检查用户名是否存在接口
     * 供前端实时校验用户名可用性
     * 
     * @param username 要检查的用户名（邮箱）
     * @return 检查结果，包含exists字段表示是否存在
     */
    @GetMapping("/check-username")
    @ApiOperation("检查用户名是否存在")
    public R checkUsername(@RequestParam("username") String username) {
        // 参数校验
        if (username == null || username.trim().isEmpty()) {
            return R.failed("用户名不能为空");
        }
        
        // 调用业务层检查用户名是否存在
        boolean exists = userSecurityService.isUsernameExists(username);
        
        // 返回检查结果
        // 修复：使用正确的R类方法，R类没有ok()和put()方法
        return R.success(new java.util.HashMap<String, Object>() {{
            put("message", "检查完成");
            put("exists", exists);
        }});
    }
}
