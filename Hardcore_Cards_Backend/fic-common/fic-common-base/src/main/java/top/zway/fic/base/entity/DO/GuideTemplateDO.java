package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 引导模板数据库实体对象
 * 对应数据库表：guide_template
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuideTemplateDO implements Serializable {
    /** 模板顺序 */
    private Integer index;

    /** 模板类型（kanban-看板，column-列，card-卡片，tag-标签） */
    private String type;

    /** 模板内容 */
    private String content;

    /** 模板颜色（16进制色值） */
    private String color;
}
