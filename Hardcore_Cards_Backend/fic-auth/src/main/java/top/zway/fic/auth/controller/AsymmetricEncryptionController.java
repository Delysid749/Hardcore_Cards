package top.zway.fic.auth.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import top.zway.fic.auth.service.AsymmetricEncryptionService;
import top.zway.fic.base.entity.VO.RsaKeyVO;
import top.zway.fic.base.result.R;

/**
 * 非对称加密控制器
 *
 * 核心功能：
 * 1. 为前端提供RSA密钥对生成服务，确保密码等敏感信息的安全传输
 * 2. 为微服务提供RPC解密服务，支持服务间的安全通信
 * 3. 实现临时密钥机制，用后即删，提高安全性
 *
 * 应用场景：
 * - 用户登录：前端获取公钥加密密码，后端解密验证
 * - 敏感数据传输：所有需要安全传输的数据都可以使用此机制
 * - 微服务通信：服务间传输敏感数据时使用RSA加密
 *
 * 安全设计：
 * - 每次请求生成新的密钥对，避免密钥重用风险
 * - 私钥存储在Redis中，设置过期时间，自动清理
 * - 解密后可选择立即删除私钥，实现一次性使用
 * - 公钥公开传输，私钥严格保密
 */
@RestController
@RequiredArgsConstructor
@Api("非对称加密")
@Slf4j
public class AsymmetricEncryptionController {

    /**
     * 非对称加密服务
     * 负责RSA密钥对的生成、管理和加解密操作
     */
    private final AsymmetricEncryptionService asymmetricEncryptionService;

    /**
     * 生成RSA密钥对接口
     *
     * 工作流程：
     * 1. 生成新的RSA密钥对（2048位）
     * 2. 私钥以Base64格式存储到Redis中，设置过期时间
     * 3. 为私钥生成唯一UUID作为标识
     * 4. 返回公钥和UUID给前端
     *
     * 前端使用方式：
     * 1. 调用此接口获取公钥和UUID
     * 2. 使用公钥加密敏感数据（如密码）
     * 3. 将加密后的数据和UUID一起提交给后端
     * 4. 后端使用UUID找到对应私钥进行解密
     *
     * 安全特性：
     * - 每次生成的密钥对都是全新的，避免重用风险
     * - 私钥有过期时间，防止长期存储带来的安全风险
     * - UUID随机生成，防止私钥被恶意猜测
     *
     * @return 包含RSA公钥和UUID的响应对象
     */
    @ApiOperation("生成rsa密钥对，并返回公钥和uuid")
    @GetMapping("/oauth/rsa")
    public R<RsaKeyVO> generateKeyPair() {
        return R.success(asymmetricEncryptionService.generateKeyPair());
    }

    /**
     * RPC解密接口
     *
     * 功能说明：
     * 1. 为微服务提供统一的解密服务
     * 2. 支持一次性解密（解密后删除私钥）
     * 3. 支持多次解密（保留私钥直到过期）
     *
     * 使用场景：
     * - 用户认证：解密前端加密的密码
     * - 服务间通信：解密其他服务发送的加密数据
     * - 敏感数据处理：解密任何需要安全传输的信息
     *
     * 参数说明：
     * - uuid: 私钥标识，用于从Redis中获取对应的私钥
     * - content: Base64编码的加密内容
     * - needDelete: 是否在解密后删除私钥（推荐设为true）
     *
     * 安全考虑：
     * - 解密操作有异常处理，防止服务异常
     * - 支持私钥的主动删除，减少安全风险
     * - 返回明文字符串，调用方需要妥善处理
     *
     * @param uuid 私钥唯一标识
     * @param content Base64编码的加密内容
     * @param needDelete 解密后是否删除私钥
     * @return 解密后的明文字符串，解密失败返回null
     */
    @ApiOperation("rpc，用uuid解密内容")
    @PostMapping("/rpc/rsa/decrypt")
    public String decrypt(@RequestParam("uuid") String uuid,
                          @RequestParam("content") String content,
                          @RequestParam("needDelete") boolean needDelete) {
        return asymmetricEncryptionService.decrypt(uuid, content, needDelete);
    }
}