package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuideTemplateDO implements Serializable {
    private Integer index;
    private String type;
    private String content;
    private String color;
}
