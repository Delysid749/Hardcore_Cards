package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * 看板列数据库实体对象
 * 对应数据库表：kanban_column
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanColumnDO implements Serializable {
    /** 列ID，主键 */
    private Long columnId;

    /** 列在看板中的排序位置 */
    private Double columnOrder;

    /** 列标题 */
    private String columnTitle;

    /** 所属看板ID */
    private Long kanbanId;

    /** 最后更新用户ID */
    private Long updateUser;

    /** 创建时间 */
    private Date createTime;

    /** 最后更新时间 */
    private Date updateTime;
}