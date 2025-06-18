package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShareKanbanDO implements Serializable {
    private Long kanbanId;

    private Long userid;

    private Boolean collected;

    private Date joinTime;
}