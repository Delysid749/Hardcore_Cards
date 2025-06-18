package top.zway.fic.base.entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanContentVO {
    private KanbanHomeVO baseInfo;

    private List<ColumnVO> columns;

    private Boolean cooperating;
}
