package top.zway.fic.base.entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import top.zway.fic.base.entity.DO.KanbanDO;
import top.zway.fic.base.entity.DO.UserInfoDO;

import java.util.Date;

/**
 * 邀请视图对象
 * 用于邀请列表页面的详细信息展示
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationVO {
    /** 邀请ID */
    private Long invitationId;

    /** 受邀用户信息 */
    private UserInfoDO invitedUserInfo;

    /** 发起邀请的用户信息 */
    private UserInfoDO sendUserInfo;

    /** 被邀请的看板标题 */
    private String kanbanTitle;

    /** 邀请时间 */
    private Date invitationTime;

    /** 邀请状态（1-未处理，2-已接受，3-已拒绝） */
    private Integer state;
}
