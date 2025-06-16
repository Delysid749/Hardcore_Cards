package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 用户角色关联数据库实体对象
 * 对应数据库表：role_user
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleUserDO implements Serializable {
    /** 角色ID */
    private Long roleId;

    /** 用户ID */
    private Long userId;
}
