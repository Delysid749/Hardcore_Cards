package top.zway.fic.base.entity.VO;

import lombok.*;
import top.zway.fic.base.entity.DO.CardDO;
import top.zway.fic.base.entity.DO.TagDO;

import java.util.Date;
import java.util.List;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardVO extends CardDO {

    private List<TagDO> tags;

    public CardVO(CardDO cardDO, List<TagDO> tags) {
        super(cardDO.getCardId(), cardDO.getOrderInColumn(), cardDO.getUpdateTime(), cardDO.getColumnId(),
                cardDO.getKanbanId(), cardDO.getContent(), cardDO.getTagged(), cardDO.getUpdateUser(), cardDO.getCreateTime());
        this.tags = tags;
    }
}
