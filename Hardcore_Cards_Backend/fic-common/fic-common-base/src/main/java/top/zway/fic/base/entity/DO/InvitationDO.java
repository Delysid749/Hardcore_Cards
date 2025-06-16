package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * 邀请数据库实体对象
 * 对应数据库表：invitation
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationDO implements Serializable {
    /** 邀请ID，主键 */
    private Long invitationId;

    /** 受邀人用户ID */
    private Long invitedUser;

    /** 发起邀请的用户ID */
    private Long sendUser;

    /** 邀请的看板ID */
    private Long kanbanId;

    /** 邀请时间 */
    private Date invitationTime;

    /** 邀请状态（1-未处理，2-已接受，3-已拒绝） */
    private Integer state;
}
