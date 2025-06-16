package top.zway.fic.base.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import top.zway.fic.base.constant.PojoValidConstants;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 用户注册数据传输对象
 * 用于用户注册时的参数接收和校验
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserDTO implements Serializable {
    /** 用户名 */
    @Email(message = "邮箱格式错误")
    @NotBlank(message = "邮箱不能为空")
    private String username;
    
    /** 密码（RSA加密后的密文） */
    @Size(min = PojoValidConstants.PASSWORD_MIN_LEN, 
          max = PojoValidConstants.PASSWORD_MAX_LEN, 
          message = "密码长度应在6-50字符之间")
    @NotBlank(message = "密码不能为空")
    private String password;

    /** 用户昵称 */
    @NotBlank(message = "昵称不能为空")
    private String nickname;

    /** 用户邮箱 */
    @NotBlank(message = "邮箱不能为空")
    private String email;

    /** 邮箱验证码 */
    @NotBlank(message = "验证码不能为空")
    private String verificationCode;

    /** RSA密钥UUID */
    @NotBlank(message = "RSA密钥UUID不能为空")
    private String rsaUuid;
}
