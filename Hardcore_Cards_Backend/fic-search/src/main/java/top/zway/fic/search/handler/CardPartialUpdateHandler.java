package top.zway.fic.search.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import top.zway.fic.base.entity.BO.SearchUpdateBO;
import top.zway.fic.base.entity.DO.CardDO;
import top.zway.fic.redis.util.RedisUtils;
import top.zway.fic.search.dao.CardDao;
import top.zway.fic.search.dao.ContentInfoIndexEsDao;
import top.zway.fic.search.entity.ContentInfoIndexEsDO;

@Service
@RequiredArgsConstructor
public class CardPartialUpdateHandler implements PartialUpdateStrategyContext.IPartialUpdateStrategy {
    private final CardDao cardDao;
    private final ContentInfoIndexEsDao contentInfoIndexEsDao;

    public static final String ID_PREFIX = "card_";

    @Override
    public void handlePartialUpdate(SearchUpdateBO searchUpdateBO) {
        CardDO cardDO = cardDao.selectByCardId(searchUpdateBO.getData());
        if (cardDO == null) {
            // 删除es
            contentInfoIndexEsDao.deleteById(ID_PREFIX + searchUpdateBO.getData());
        } else {
            // 更新es
            ContentInfoIndexEsDO e = new ContentInfoIndexEsDO(ID_PREFIX + searchUpdateBO.getData(), cardDO.getKanbanId(),
                    cardDO.getColumnId(), searchUpdateBO.getData(), null, cardDO.getContent());
            contentInfoIndexEsDao.save(e);
        }
    }

    @Override
    public SearchUpdateBO.UpdateTypeEnum getType() {
        return SearchUpdateBO.UpdateTypeEnum.CARD;
    }
}
