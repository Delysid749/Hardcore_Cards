package top.zway.fic.base.entity.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import top.zway.fic.base.constant.PojoValidConstants;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 卡片数据传输对象
 * 用于前端卡片操作的参数传递
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CardDTO implements Serializable {
    /** 卡片ID（更新时使用） */
    private Long cardId;

    /** 卡片内容 */
    @Size(max = PojoValidConstants.CARD_CONTEXT_MAX_LEN, message = "卡片内容最大为250字符")
    @NotBlank(message = "卡片内容不能为空")
    private String content;

    /** 所属列ID */
    @NotNull(message = "列ID不能为空")
    private Long columnId;

    /** 卡片在列中的排序位置 */
    private Double orderInColumn;
}
