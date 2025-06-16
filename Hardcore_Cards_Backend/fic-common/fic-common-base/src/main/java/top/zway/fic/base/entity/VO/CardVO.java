package top.zway.fic.base.entity.VO;

import lombok.*;
import top.zway.fic.base.entity.DO.CardDO;
import top.zway.fic.base.entity.DO.TagDO;

import java.util.Date;
import java.util.List;

/**
 * 卡片视图对象
 * 用于看板页面卡片的详细信息展示
 */
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardVO extends CardDO {

    /** 卡片关联的标签列表 */
    private List<TagDO> tags;

    public CardVO(CardDO cardDO, List<TagDO> tags) {
        super(cardDO.getCardId(), cardDO.getOrderInColumn(), cardDO.getUpdateTime(), cardDO.getColumnId(),
                cardDO.getKanbanId(), cardDO.getContent(), cardDO.getTagged(), cardDO.getUpdateUser(), cardDO.getCreateTime());
        this.tags = tags;
    }
}
