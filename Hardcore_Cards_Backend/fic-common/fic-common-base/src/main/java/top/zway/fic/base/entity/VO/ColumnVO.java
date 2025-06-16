package top.zway.fic.base.entity.VO;

import lombok.*;
import top.zway.fic.base.entity.DO.KanbanColumnDO;

import java.util.Date;
import java.util.List;

/**
 * 列视图对象
 * 用于看板页面列和卡片的组合展示
 */
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColumnVO extends KanbanColumnDO {
    /** 该列下的卡片列表 */
    private List<CardVO> cards;

    public ColumnVO(KanbanColumnDO kanbanColumnDO, List<CardVO> cards) {
        super(kanbanColumnDO.getColumnId(), kanbanColumnDO.getColumnOrder(), kanbanColumnDO.getColumnTitle(),
                kanbanColumnDO.getKanbanId(), kanbanColumnDO.getUpdateUser(), kanbanColumnDO.getCreateTime(),
                kanbanColumnDO.getUpdateTime());
        this.cards = cards;
    }
}
