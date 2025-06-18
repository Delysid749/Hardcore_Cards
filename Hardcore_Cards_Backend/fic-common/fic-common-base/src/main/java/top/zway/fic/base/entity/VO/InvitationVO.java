package top.zway.fic.base.entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import top.zway.fic.base.entity.DO.KanbanDO;
import top.zway.fic.base.entity.DO.UserInfoDO;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationVO {
    private Long invitationId;
    private Long invitedUser;
    private UserInfoDO sendUser;
    private KanbanDO kanbanId;
    private Date invitationTime;
    private Integer state;
}
