package top.zway.fic.search.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import top.zway.fic.base.entity.BO.SearchUpdateBO;
import top.zway.fic.base.entity.DO.KanbanDO;
import top.zway.fic.redis.util.RedisUtils;
import top.zway.fic.search.dao.ContentInfoIndexEsDao;
import top.zway.fic.search.dao.KanbanDao;
import top.zway.fic.search.entity.ContentInfoIndexEsDO;

@Service
@RequiredArgsConstructor
public class KanbanPartialUpdateHandler implements PartialUpdateStrategyContext.IPartialUpdateStrategy {
    private final KanbanDao kanbanDao;
    private final ContentInfoIndexEsDao contentInfoIndexEsDao;

    public static final String ID_PREFIX = "kanban_";

    @Override
    public void handlePartialUpdate(SearchUpdateBO searchUpdateBO) {
        KanbanDO kanbanDO = kanbanDao.selectByPrimaryKey(searchUpdateBO.getData());
        if (kanbanDO == null) {
            // 删除es
            contentInfoIndexEsDao.deleteById(ID_PREFIX + searchUpdateBO.getData());
        } else {
            // 更新es
            ContentInfoIndexEsDO e = new ContentInfoIndexEsDO(ID_PREFIX + searchUpdateBO.getData(),
                    searchUpdateBO.getData(), null, null, null, kanbanDO.getTitle());
            contentInfoIndexEsDao.save(e);
        }
    }

    @Override
    public SearchUpdateBO.UpdateTypeEnum getType() {
        return SearchUpdateBO.UpdateTypeEnum.KANBAN;
    }
}
