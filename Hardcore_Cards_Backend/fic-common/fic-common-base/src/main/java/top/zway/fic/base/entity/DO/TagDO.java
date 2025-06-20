package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TagDO implements Serializable {
    private Long tagId;

    private Long cardId;

    private Integer type;

    private String color;

    private String content;

    private Long kanbanId;

    private Long createUser;

    private Date createTime;
}