package top.zway.fic.kanban.dao;

import org.apache.ibatis.annotations.Mapper;
import top.zway.fic.base.entity.doo.GuideTemplateDO;

import java.util.List;

@Mapper
public interface GuideTemplateDao {
    List<GuideTemplateDO> getAll();
}
