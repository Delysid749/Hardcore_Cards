package top.zway.fic.base.entity.AO;

import lombok.*;
import top.zway.fic.base.entity.DTO.KanbanColumnDTO;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 看板列应用对象
 * 用于列操作的应用层数据传输，包含更新用户信息
 */
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanColumnAO extends KanbanColumnDTO {
    /** 更新用户ID */
    private Long updateUser;

    /** 构造函数：从KanbanColumnDTO组装KanbanColumnAO */
    public KanbanColumnAO(KanbanColumnDTO kanbanColumnDTO, Long updateUser) {
        super(kanbanColumnDTO.getColumnId(), kanbanColumnDTO.getColumnTitle(), 
              kanbanColumnDTO.getKanbanId(), kanbanColumnDTO.getColumnOrder());
        this.updateUser = updateUser;
    }
}
