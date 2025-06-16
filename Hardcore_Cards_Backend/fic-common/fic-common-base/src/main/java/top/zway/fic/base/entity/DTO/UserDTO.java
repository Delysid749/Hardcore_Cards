package top.zway.fic.base.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
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

    /** 用户角色列表 */
    private List<String> roles;
}
