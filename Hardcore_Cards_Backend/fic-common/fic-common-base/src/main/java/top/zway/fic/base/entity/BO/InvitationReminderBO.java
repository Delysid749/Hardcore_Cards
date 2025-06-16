package top.zway.fic.base.entity.BO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 邀请提醒业务对象
 * 用于消息队列中邀请提醒的数据传输
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationReminderBO implements Serializable {
    /** 邀请ID */
    private Long invitationId;

    /** 发起邀请的用户ID */
    private Long sendUserId;

    /** 被邀请的用户ID */
    private Long invitedUserId;

    /** 邀请的看板ID */
    private Long kanbanId;

    /** 看板标题 */
    private String kanbanTitle;

    /** 发起邀请的用户昵称 */
    private String sendUserNickname;

    /** 被邀请用户的邮箱 */
    private String invitedUserEmail;
}
