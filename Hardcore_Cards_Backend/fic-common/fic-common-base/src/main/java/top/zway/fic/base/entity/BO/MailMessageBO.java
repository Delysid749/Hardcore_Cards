package top.zway.fic.base.entity.BO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MailMessageBO implements Serializable {
    private String to;
    private String subject;
    private String content;
}
