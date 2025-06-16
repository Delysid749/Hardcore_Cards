package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

/**
 * 卡片数据库实体对象
 * 对应数据库表：card
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardDO implements Serializable {
    /** 卡片ID，主键 */
    private Long cardId;

    // 为加快计算，使用double得精度消失问题可以忽略

    /** 卡片在列中的排序位置 */
    private Double orderInColumn;

    /** 最后更新时间 */
    private Date updateTime;

    /** 所属列ID */
    private Long columnId;

    /** 所属看板ID */
    private Long kanbanId;

    /** 卡片内容 */
    private String content;

    /** 是否带有标签（0-无标签，1-有标签） */
    private Boolean tagged;

    /** 最后更新用户ID */
    private Long updateUser;

    /** 创建时间 */
    private Date createTime;
}