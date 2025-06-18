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
 * 
 * 功能说明：
 * 1. 封装前端提交的用户注册信息
 * 2. 支持JSR-303参数校验
 * 3. RSA加密是可选的，兼容不同的前端实现
 * 
 * 字段说明：
 * - username: 用户邮箱，作为登录凭证
 * - password: 用户密码，可以是明文或RSA加密后的密文
 * - rsaUuid: RSA私钥标识，为空时表示不使用RSA加密
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserDTO implements Serializable {
    
    /**
     * 用户邮箱
     * 作为用户名和登录凭证使用
     */
    @Email(message = "邮箱格式错误")
    @NotBlank(message = "邮箱不能为空")
    private String username;
    
    /**
     * 用户密码
     * 可以是明文密码或RSA加密后的密文
     */
    @NotBlank(message = "密码不能为空")
    private String password;

    /**
     * RSA私钥唯一标识
     * 
     * 使用说明：
     * - 如果为空或null，则直接使用明文密码注册
     * - 如果有值，则使用对应的RSA私钥解密password字段
     * 
     * 注意：移除了@NotBlank注解，使RSA加密变为可选
     */
    private String rsaUuid;
}
