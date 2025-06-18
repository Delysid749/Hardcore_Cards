package top.zway.fic.base.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO implements Serializable {
    private Long id;
    private String username;
    private String password;
    private Integer status;
    private List<String> roles;

    // 新增字段
    private Boolean accountNonExpired;      // 账户是否未过期
    private Boolean accountNonLocked;       // 账户是否未锁定
    private Boolean credentialsNonExpired;  // 凭证是否未过期
}
