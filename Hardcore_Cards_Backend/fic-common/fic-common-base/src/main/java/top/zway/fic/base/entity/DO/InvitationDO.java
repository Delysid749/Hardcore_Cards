package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationDO {
    private Long invitationId;
    private Long invitedUser;
    private Long sendUser;
    private Long kanbanId;
    private Date invitationTime;
    private Integer state;
}
