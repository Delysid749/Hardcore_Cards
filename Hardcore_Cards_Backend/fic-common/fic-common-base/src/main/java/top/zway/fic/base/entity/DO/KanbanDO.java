package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * 看板数据库实体对象
 * 对应数据库表：kanban
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanDO implements Serializable {
    /** 看板ID，主键 */
    private Long kanbanId;

    /** 看板所有者用户ID */
    private Long ownerId;

    /** 看板标题 */
    private String title;

    /** 创建时间 */
    private Date createTime;

    /** 看板颜色（16进制色值） */
    private String color;

    /** 看板类型（1-普通看板，3-引导看板） */
    private Integer type;

    /** 最后更新时间 */
    private Date updateTime;
}