package top.zway.fic.auth.controller;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.KeyPair;
import java.security.interfaces.RSAPublicKey;
import java.util.Map;

/**
 * JWT密钥对控制器
 *
 * 主要功能：
 * 1. 暴露JWT签名验证所需的RSA公钥
 * 2. 为其他微服务提供JWT token验证能力
 * 3. 支持标准的JWK（JSON Web Key）格式
 *
 * 使用场景：
 * - 网关服务需要获取公钥来验证JWT token的有效性
 * - 其他微服务可以通过此端点获取公钥进行token验证
 * - 前端可能需要获取公钥进行某些加密操作
 *
 * 安全考虑：
 * - 公钥是公开信息，可以安全地暴露给外部调用
 * - 私钥严格保密，仅用于JWT签名，不对外暴露
 * - 符合非对称加密体系的安全原则
 */
@RestController
public class KeyPairController {

    /**
     * JWT签名密钥对
     * 从OAuth2ServerConfig配置类中注入的RSA密钥对
     * 私钥用于JWT签名，公钥用于JWT验证
     */
    @Autowired
    private KeyPair keyPair;

    /**
     * 获取JWT验证公钥
     *
     * 功能说明：
     * 1. 提取RSA密钥对中的公钥部分
     * 2. 将公钥转换为标准JWK格式
     * 3. 返回JSON格式的公钥信息
     *
     * JWK格式优势：
     * - 标准化：遵循RFC 7517标准
     * - 兼容性：各种JWT库都支持JWK格式
     * - 完整性：包含密钥类型、算法等元数据
     *
     * 返回格式示例：
     * {
     *   "keys": [{
     *     "kty": "RSA",
     *     "use": "sig",
     *     "n": "公钥模数",
     *     "e": "公钥指数"
     *   }]
     * }
     *
     * @return JWK格式的公钥JSON对象
     */
    @GetMapping("/rsa/publicKey")
    public Map<String, Object> getKey() {
        // 从密钥对中提取RSA公钥
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();

        // 构建RSA JWK对象
        RSAKey key = new RSAKey.Builder(publicKey).build();

        // 转换为JWK Set格式并返回JSON对象
        return new JWKSet(key).toJSONObject();
    }

}