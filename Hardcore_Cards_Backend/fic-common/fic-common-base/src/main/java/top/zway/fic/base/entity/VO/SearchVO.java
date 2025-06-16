package top.zway.fic.base.entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 搜索视图对象
 * 用于搜索结果的数据传输
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchVO {
    /** 搜索内容 */
    private String content;
    
    /** 搜索结果类型 */
    private String type;
    
    /** 关联的看板ID */
    private Long kanbanId;
}
