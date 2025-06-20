package top.zway.fic.base.entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import top.zway.fic.base.entity.DO.KanbanDO;
import top.zway.fic.base.entity.DO.ShareKanbanDO;
import top.zway.fic.base.entity.DO.UserInfoDO;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanHomeVO {
    private Long kanbanId;

    private Long ownerId;

    private String title;

    private Date createTime;

    private String color;

    private Integer type;

    private Date updateTime;

    private Boolean collected;

    private Date joinTime;

    private List<UserInfoDO> member;

    public KanbanHomeVO(KanbanDO kanbanDO, ShareKanbanDO shareKanbanDO, List<UserInfoDO> member) {
        this.kanbanId = kanbanDO.getKanbanId();
        this.ownerId = kanbanDO.getOwnerId();
        this.title = kanbanDO.getTitle();
        this.createTime = kanbanDO.getCreateTime();
        this.color = kanbanDO.getColor();
        this.type = kanbanDO.getType();
        this.updateTime = kanbanDO.getUpdateTime();
        this.collected = shareKanbanDO.getCollected();
        this.joinTime = shareKanbanDO.getJoinTime();
        this.member = member;
    }
}
