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
 * 看板列数据传输对象
 * 用于前端列操作的参数传递
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanColumnDTO implements Serializable {
    /** 列ID（更新时使用） */
    private Long columnId;

    /** 列标题 */
    @Size(max = PojoValidConstants.COLUMN_TITLE_MAX_LEN, message = "列标题最大为30字符")
    @NotBlank(message = "列标题不能为空")
    private String columnTitle;

    /** 所属看板ID */
    @NotNull(message = "看板ID不能为空")
    private Long kanbanId;

    /** 列在看板中的排序位置 */
    private Double columnOrder;
}
