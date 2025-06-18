package top.zway.fic.base.entity.AO;

import lombok.*;
import org.hibernate.validator.constraints.Range;
import top.zway.fic.base.entity.DTO.KanbanDTO;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanAO extends KanbanDTO {
    private Long ownerId;

    public KanbanAO(KanbanDTO kanbanDTO, Long ownerId) {
        super(kanbanDTO.getKanbanId(), kanbanDTO.getTitle(), kanbanDTO.getColor(), kanbanDTO.getType());
        this.ownerId = ownerId;
    }
}
