package top.zway.fic.base.entity.BO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 搜索更新业务对象
 * 用于Elasticsearch索引更新的数据传输
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchUpdateBO implements Serializable {
    /** 文档ID */
    private String id;

    /** 文档内容 */
    private String content;

    /** 文档类型（card-卡片，kanban-看板等） */
    private String type;

    /** 关联的看板ID */
    private Long kanbanId;

    /** 用户ID */
    private Long userId;

    /** 操作类型（add-新增，update-更新，delete-删除） */
    private String operation;
}
