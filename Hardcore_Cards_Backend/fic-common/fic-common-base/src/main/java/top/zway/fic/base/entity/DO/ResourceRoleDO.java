package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 资源角色权限数据库实体对象
 * 对应数据库表：resource_role
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceRoleDO implements Serializable {
    /** 资源URL路径 */
    private String url;

    /** 访问该资源所需的角色 */
    private String role;
}
