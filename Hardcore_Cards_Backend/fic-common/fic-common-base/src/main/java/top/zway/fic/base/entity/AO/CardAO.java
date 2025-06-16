package top.zway.fic.base.entity.AO;

import lombok.*;
import top.zway.fic.base.entity.DTO.CardDTO;

/**
 * 卡片应用对象
 * 用于卡片操作的应用层数据传输，包含更新用户信息
 */
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardAO extends CardDTO {
    /** 更新用户ID */
    private Long updateUser;

    /** 构造函数：从CardDTO组装CardAO */
    public CardAO(CardDTO cardDTO, Long updateUser) {
        super(cardDTO.getCardId(), cardDTO.getColumnId(), cardDTO.getKanbanId(), cardDTO.getContent());
        this.updateUser = updateUser;
    }
}
