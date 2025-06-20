package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KanbanDO implements Serializable {
    private Long kanbanId;

    private Long ownerId;

    private String title;

    private Date createTime;

    private String color;

    private Integer type;

    private Date updateTime;
}