package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * 用户数据库实体对象
 * 对应数据库表：user
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDO implements Serializable {
    /** 用户ID，主键 */
    private Long id;

    /** 用户名 */
    private String username;

    /** 密码（加密存储） */
    private String password;

    /** 是否启用（true-启用，false-禁用） */
    private Boolean enabled;

    /** 创建时间 */
    private Date createTime;
}
