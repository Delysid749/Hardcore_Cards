package top.zway.fic.kanban.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.zway.fic.base.entity.AO.CardAO;
import top.zway.fic.base.entity.BO.SearchUpdateBO;
import top.zway.fic.base.entity.DO.CardDO;
import top.zway.fic.kanban.alg.MoveItemAlg;
import top.zway.fic.kanban.dao.CardDao;
import top.zway.fic.kanban.dao.ColumnDao;
import top.zway.fic.kanban.dao.ShareKanbanDao;
import top.zway.fic.kanban.dao.TagDao;
import top.zway.fic.kanban.service.CacheService;
import top.zway.fic.kanban.service.CardService;
import top.zway.fic.kanban.service.SearchUpdateService;
import top.zway.fic.web.exception.BizException;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {
    private final CardDao cardDao;
    private final ShareKanbanDao shareKanbanDao;
    private final TagDao tagDao;
    private final ColumnDao columnDao;
    private final CacheService cacheService;
    private final SearchUpdateService searchUpdateService;

    @Override
    public boolean insertCard(CardAO cardAo) {
        // 列是否在此看板
        Long kanbanId = columnDao.getKanbanIdByColumnId(cardAo.getColumnId());
        if (kanbanId == null || kanbanId.longValue() != cardAo.getKanbanId().longValue()) {
            return false;
        }
        // 鉴权
        if (isNoAuthorityByKanbanId(kanbanId, cardAo.getUpdateUser()) == null) {
            return false;
        }
        // 找到最后的顺序
        Double lastOrder = cardDao.getLastOrder(cardAo.getColumnId());
        // Do对象
        CardDO cardDO = new CardDO(null, null, null, cardAo.getColumnId(), cardAo.getKanbanId(),
                cardAo.getContent(), false, cardAo.getUpdateUser(), null);
        // 加减 9-11
        cardDO.setOrderInColumn(lastOrder == null ? 1 : lastOrder + ThreadLocalRandom.current().nextDouble(2) + 9);
        // 插入
        int insert = cardDao.insert(cardDO);
        // 更新缓存
        cacheService.doubleDelayedDeleteKanbanCache(kanbanId);
        searchUpdateService.update(new SearchUpdateBO(kanbanId, SearchUpdateBO.UpdateTypeEnum.CARD, cardDO.getCardId()));
        return insert > 0;
    }

    private Long isNoAuthorityByCardId(Long cardId, Long userId) {
        // 卡片是否在此看板
        Long kanbanId = cardDao.getKanbanIdByCardId(cardId);
        if (kanbanId == null) {
            return null;
        }
        return isNoAuthorityByKanbanId(kanbanId, userId);
    }

    private Long isNoAuthorityByKanbanId(Long kanbanId, Long userId) {
        // 鉴权
        int count = shareKanbanDao.countHaveJoinedUser(kanbanId, userId);
        return count <= 0 ? null : kanbanId;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteCard(Long cardId, Long userId) {
        // 鉴权
        Long kanbanId = isNoAuthorityByCardId(cardId, userId);
        if (kanbanId == null) {
            return false;
        }
        // 删tag
        tagDao.deleteByCardId(cardId);
        // 删card
        int delete = cardDao.delete(cardId);
        // 更新缓存
        cacheService.doubleDelayedDeleteKanbanCache(kanbanId);
        searchUpdateService.update(new SearchUpdateBO(kanbanId, SearchUpdateBO.UpdateTypeEnum.CARD, cardId));
        return delete > 0;
    }

    @Override
    public boolean updateColumn(CardAO cardAo) {
        // 鉴权
        Long kanbanId = isNoAuthorityByCardId(cardAo.getCardId(), cardAo.getUpdateUser());
        if (kanbanId == null) {
            return false;
        }
        // 修改
        CardDO record = new CardDO(cardAo.getCardId(), null, null, null, null,
                cardAo.getContent(), null, cardAo.getUpdateUser(), null);
        int updateBaseInfo = cardDao.updateBaseInfo(record);
        // 更新缓存
        cacheService.doubleDelayedDeleteKanbanCache(kanbanId);
        searchUpdateService.update(new SearchUpdateBO(kanbanId, SearchUpdateBO.UpdateTypeEnum.CARD, cardAo.getCardId()));
        return updateBaseInfo > 0;
    }

    @Override
    public boolean moveColumn(Integer move, Long cardId, Long userId) {
        // 鉴权
        Long kanbanId = isNoAuthorityByCardId(cardId, userId);
        if (kanbanId == null) {
            return false;
        }
        if (move == 0) {
            throw new BizException("移动位置不能为0");
        }
        boolean down = move > 0;
        int getSize = Math.abs(move) + 2;
        // 获取上下的顺序
        Long columnId = cardDao.getColumnIdByCardId(cardId);
        List<Double> orders = cardDao.getSortedOrderAfterOrBefore(cardId, columnId, getSize, down);
        // 计算新顺序
        Double newOrder = MoveItemAlg.countNewOrder(orders, getSize, down);
        int update = cardDao.setOrder(newOrder, cardId);
        // 更新缓存 不需要更新搜索
        cacheService.doubleDelayedDeleteKanbanCache(kanbanId);
        return update > 0;
    }

    @Override
    public boolean transferCard(Long cardId, Long columnId, Long userId) {
        // 鉴权
        Long kanbanIdByCardId = cardDao.getKanbanIdByCardId(cardId);
        Long kanbanIdByColumnId = columnDao.getKanbanIdByColumnId(columnId);
        if (kanbanIdByCardId == null || kanbanIdByColumnId == null ||
                kanbanIdByCardId.longValue() != kanbanIdByColumnId.longValue()) {
            return false;
        }
        if (isNoAuthorityByKanbanId(kanbanIdByCardId, userId) == null) {
            return false;
        }
        Double lastOrder = cardDao.getLastOrder(columnId);
        if (lastOrder == null) {
            lastOrder = (double) 0;
        }
        int transferCard = cardDao.transferCard(cardId, lastOrder + 1, columnId);
        // 更新缓存
        cacheService.doubleDelayedDeleteKanbanCache(kanbanIdByCardId);
        searchUpdateService.update(new SearchUpdateBO(kanbanIdByCardId, SearchUpdateBO.UpdateTypeEnum.CARD, cardId));
        return transferCard > 0;
    }
}
