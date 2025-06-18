package top.zway.fic.base.entity.AO;

import lombok.*;
import top.zway.fic.base.entity.DTO.CardDTO;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardAO extends CardDTO {
    private Long updateUser;

    public CardAO(CardDTO cardDTO, Long updateUser) {
        super(cardDTO.getCardId(), cardDTO.getColumnId(), cardDTO.getKanbanId(), cardDTO.getContent());
        this.updateUser = updateUser;
    }
}
