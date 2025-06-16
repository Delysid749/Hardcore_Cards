package top.zway.fic.base.entity.AO;

import lombok.*;
import org.hibernate.validator.constraints.Range;
import top.zway.fic.base.entity.DTO.KanbanDTO;
import top.zway.fic.base.constant.PojoValidConstants;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 看板应用对象
 * 用于看板操作的应用层数据传输
 */
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanAO extends KanbanDTO implements Serializable {
    /** 看板ID */
    private Long kanbanId;

    /** 看板标题 */
    @Size(max = PojoValidConstants.KANBAN_TITLE_MAX_LEN, message = "看板名称最大为80字符")
    @NotBlank(message = "看板名称不能为空")
    private String title;

    /** 看板颜色 */
    @Pattern(regexp = "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$", message = "颜色格式错误")
    private String color;

    /** 看板类型 */
    private Integer type;

    /** 操作用户ID */
    @NotNull(message = "用户ID不能为空")
    private Long userId;

    public KanbanAO(KanbanDTO kanbanDTO, Long ownerId) {
        super(kanbanDTO.getKanbanId(), kanbanDTO.getTitle(), kanbanDTO.getColor(), kanbanDTO.getType());
        this.userId = ownerId;
    }
}
