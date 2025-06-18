package top.zway.fic.base.entity.BO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationReminderBO {
    /**
     * 邀请人昵称
     */
    private String inviter;
    /**
     * 被邀请人邮箱
     */
    private String inviteeEmail;
    /**
     * 看板名称
     */
    private String kanbanName;
}
