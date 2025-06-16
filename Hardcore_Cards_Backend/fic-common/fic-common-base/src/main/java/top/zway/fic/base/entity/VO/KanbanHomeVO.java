package top.zway.fic.base.entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import top.zway.fic.base.entity.DO.KanbanDO;
import top.zway.fic.base.entity.DO.ShareKanbanDO;
import top.zway.fic.base.entity.DO.UserInfoDO;

import java.util.Date;
import java.util.List;

/**
 * 看板首页视图对象
 * 用于首页看板列表的数据展示
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanHomeVO {
    /** 看板ID */
    private Long kanbanId;

    /** 看板所有者ID */
    private Long ownerId;

    /** 看板标题 */
    private String title;

    /** 创建时间 */
    private Date createTime;

    /** 看板颜色 */
    private String color;

    /** 看板类型 */
    private Integer type;

    /** 最后更新时间 */
    private Date updateTime;

    /** 是否已收藏 */
    private Boolean collected;

    /** 加入时间 */
    private Date joinTime;

    /** 协作成员列表 */
    private List<UserInfoDO> member;

    /** 构造函数：从DO对象组装VO */
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
