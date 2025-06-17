package top.zway.fic.base.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import top.zway.fic.base.constant.PojoValidConstants;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 标签数据传输对象
 * 用于前端标签操作的参数传递
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO implements Serializable {

    /** 所属卡片ID */
    @NotNull(message = "卡片ID不能为空")
    private Long cardId;



    /** 标签颜色（16进制色值） */
    @Pattern(regexp = "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$", message = "颜色格式错误")
    private String color;

    /** 标签内容 */
    @Size(max = PojoValidConstants.TAG_CONTEXT_MAX_LEN, message = "标签内容最大为15字符")
    private String content;

    // 看板id与用户在看板表是可信的，再去查看板与card关系是否存在

    private Long kanbanId;
}
