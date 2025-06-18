package top.zway.fic.base.entity.AO;

import lombok.*;
import top.zway.fic.base.entity.DTO.KanbanColumnDTO;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanColumnAO extends KanbanColumnDTO {
    private Long updateUser;

    public KanbanColumnAO(KanbanColumnDTO kanbanColumnDTO, Long updateUser) {
        super(kanbanColumnDTO.getColumnId(), kanbanColumnDTO.getColumnTitle(), kanbanColumnDTO.getKanbanId());
        this.updateUser = updateUser;
    }
}
