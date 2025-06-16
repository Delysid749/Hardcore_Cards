package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * 看板共享数据库实体对象
 * 对应数据库表：share_kanban
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShareKanbanDO implements Serializable {
    /** 看板ID */
    private Long kanbanId;

    /** 用户ID */
    private Long userid;

    /** 是否收藏（false-未收藏，true-已收藏） */
    private Boolean collected;

    /** 加入时间 */
    private Date joinTime;
}