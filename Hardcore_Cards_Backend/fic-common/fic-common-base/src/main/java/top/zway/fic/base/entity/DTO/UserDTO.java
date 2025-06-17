package top.zway.fic.base.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 用户数据传输对象
 * 用于用户信息传递和权限管理
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO implements Serializable {
    /** 用户ID */
    private Long id;

    /** 用户名 */
    private String username;

    //密码
    private String password;

    //状态
    private Integer status;

    /** 用户角色列表 */
    private List<String> roles;

    private Boolean accountNonExpired;         // 账户过期状态
    private Boolean accountNonLocked;          // 账户锁定状态
    private Boolean credentialsNonExpired;     // 凭证过期状态
    private Date accountExpireTime;            // 账户过期时间
    private Date credentialsExpireTime;        // 凭证过期时间
    private Integer loginFailCount;            // 登录失败次数
}
