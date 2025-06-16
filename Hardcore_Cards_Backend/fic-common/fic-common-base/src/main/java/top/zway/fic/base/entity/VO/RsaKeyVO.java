package top.zway.fic.base.entity.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * RSA密钥视图对象
 * 用于前端RSA加密时的公钥传输
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RsaKeyVO {
    /** RSA公钥字符串 */
    private String publicKey;
    
    /** RSA密钥对的唯一标识UUID */
    private String uuid;
}
