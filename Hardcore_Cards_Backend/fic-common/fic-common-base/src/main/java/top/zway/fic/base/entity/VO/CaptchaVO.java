package top.zway.fic.base.entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaptchaVO {
    private String captcha;
    private String uuid;
}
