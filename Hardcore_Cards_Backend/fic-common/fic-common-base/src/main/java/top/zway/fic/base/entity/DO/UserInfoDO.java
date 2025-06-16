package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 用户信息数据库实体对象
 * 对应数据库表：user_info
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDO implements Serializable {
    /** 用户ID，主键 */
    private Long id;

    /** 用户昵称 */
    private String nickname;

    /** 用户头像URL */
    private String avatar;

    /** 用户邮箱 */
    private String email;
}
