package top.zway.fic.base.entity.BO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 邮件消息业务对象
 * 用于消息队列中邮件发送的数据传输
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MailMessageBO implements Serializable {
    /** 收件人邮箱地址 */
    private String to;

    /** 邮件主题 */
    private String subject;

    /** 邮件内容 */
    private String content;
}
