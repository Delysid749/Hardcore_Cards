package top.zway.fic.user.rpc;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * RSA加密解密RPC服务接口
 * 
 * 功能说明：
 * 1. 通过Feign客户端调用认证服务的RSA解密接口
 * 2. 用于解密前端通过RSA公钥加密的敏感数据（如密码）
 * 3. 支持服务间的安全通信
 * 
 * 调用流程：
 * 1. 前端获取RSA公钥和UUID
 * 2. 前端使用公钥加密敏感数据
 * 3. 用户服务通过此接口调用认证服务解密数据
 * 4. 认证服务使用对应的私钥进行解密
 * 
 * 容错机制：
 * - 配置了fallback降级处理
 * - 当认证服务不可用时，会调用降级实现
 */
@FeignClient(contextId = "rsaRpcService", name = "fic-auth", fallback = RsaRpcServiceFallback.class)
public interface RsaRpcService {
    
    /**
     * RSA解密接口
     * 
     * 参数说明：
     * @param uuid RSA私钥的唯一标识，由认证服务生成
     * @param content Base64编码的RSA加密内容
     * @param needDelete 解密后是否删除私钥（推荐设为true）
     * @return 解密后的明文字符串，解密失败返回null
     */
    @PostMapping("/rpc/rsa/decrypt")
    String decrypt(@RequestParam("uuid") String uuid, @RequestParam("content") String content, @RequestParam("needDelete") boolean needDelete);
}