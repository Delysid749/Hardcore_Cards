package top.zway.fic.base.entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 看板内容视图对象
 * 用于看板详情页面的完整内容展示
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanContentVO {
    /** 看板ID */
    private Long kanbanId;

    /** 看板标题 */
    private String title;

    /** 看板颜色 */
    private String color;

    /** 看板类型 */
    private Integer type;

    /** 看板下的列列表（包含卡片信息） */
    private List<ColumnVO> columns;
}
