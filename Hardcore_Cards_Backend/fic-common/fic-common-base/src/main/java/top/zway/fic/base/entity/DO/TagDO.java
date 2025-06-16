package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * 标签数据库实体对象
 * 对应数据库表：tag
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagDO implements Serializable {
    /** 标签ID，主键 */
    private Long tagId;

    /** 所属卡片ID */
    private Long cardId;

    /** 标签类型（1-默认类型） */
    private Integer type;

    /** 标签颜色（16进制色值） */
    private String color;

    /** 标签内容 */
    private String content;

    /** 所属看板ID */
    private Long kanbanId;

    /** 创建用户ID */
    private Long createUser;

    /** 创建时间 */
    private Date createTime;
}