package top.zway.fic.base.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;
import top.zway.fic.base.constant.PojoValidConstants;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 看板数据传输对象
 * 用于前端请求参数接收和校验
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanDTO implements Serializable {
    /** 看板ID（更新时使用） */
    private Long kanbanId;

    /** 看板标题 */
    @Size(max = PojoValidConstants.KANBAN_TITLE_MAX_LEN,
            message = "看板名称最大为80")
    @NotBlank(message = "看板名称不能为空")
    private String title;

    /** 看板颜色（16进制色值） */
    @Pattern(regexp = "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$",
            message = "颜色错误")
    private String color;

    /** 看板类型 */
    @Range(min = PojoValidConstants.KANBAN_TYPE_MIN_VALUE,
            max = PojoValidConstants.KANBAN_TYPE_MAX_VALUE,
            message = "看板类型错误")
    private Integer type;
}
