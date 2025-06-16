package top.zway.fic.base.entity.AO;

import lombok.*;
import top.zway.fic.base.entity.DTO.TagDTO;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

/**
 * 标签应用对象
 * 用于标签操作的应用层数据传输，包含创建用户信息
 */
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagAO extends TagDTO {
    /** 创建用户ID */
    private Long createUser;

    /** 所属看板ID */
    private Long kanbanId;

    /** 构造函数：从TagDTO组装TagAO */
    public TagAO(TagDTO tagDTO, Long createUser, Long kanbanId) {
        super(tagDTO.getTagId(), tagDTO.getCardId(), tagDTO.getContent(), 
              tagDTO.getColor(), tagDTO.getType());
        this.createUser = createUser;
        this.kanbanId = kanbanId;
    }
}
