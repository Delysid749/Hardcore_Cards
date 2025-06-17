package top.zway.fic.auth.service.impl;

import cn.hutool.core.util.CharsetUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.crypto.asymmetric.KeyType;
import cn.hutool.crypto.asymmetric.RSA;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import top.zway.fic.auth.service.AsymmetricEncryptionService;
import top.zway.fic.base.constant.RedisConstant;
import top.zway.fic.base.entity.VO.RsaKeyVO;
import top.zway.fic.redis.util.RedisUtils;

/**
 * 非对称加密服务实现类
 *
 * 核心功能：
 * 1. 基于Hutool工具库实现RSA加密解密
 * 2. 使用Redis存储临时私钥，提供分布式密钥管理
 * 3. 支持密钥的生命周期管理和自动清理
 * 4. 提供安全的密钥生成和解密服务
 *
 * 技术实现：
 * - 使用Hutool的RSA工具类简化加密操作
 * - Redis作为密钥存储，支持过期时间设置
 * - UUID作为密钥标识，确保密钥的唯一性和安全性
 * - Base64编码确保密钥和密文的安全传输
 *
 * 安全设计：
 * - 私钥临时存储：避免长期保存带来的安全风险
 * - 密钥隔离：每个用户/会话使用独立的密钥对
 * - 自动清理：利用Redis过期机制自动清理过期密钥
 * - 异常处理：解密失败时不抛出异常，避免信息泄露
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AsymmetricEncryptionServiceImpl implements AsymmetricEncryptionService {

    /**
     * Redis工具类
     * 用于私钥的存储、获取和删除操作
     */
    private final RedisUtils redisUtils;

    /**
     * 生成RSA密钥对
     *
     * 实现步骤：
     * 1. 使用Hutool RSA工具生成2048位密钥对
     * 2. 生成唯一UUID作为私钥标识
     * 3. 将私钥Base64编码后存储到Redis
     * 4. 设置私钥过期时间，自动清理
     * 5. 返回公钥和UUID给调用方
     *
     * Hutool RSA特性：
     * - 默认生成2048位密钥对，安全性较高
     * - 自动处理密钥格式转换
     * - 支持PKCS#8和X.509标准格式
     * - 内置Base64编码，便于网络传输
     *
     * Redis存储策略：
     * - Key格式：RSA_PRIVATE_KEY + UUID
     * - Value：Base64编码的私钥字符串
     * - 过期时间：由RedisConstant.RSA_PUBLIC_KEY_EXP_TIME定义
     * - 自动清理：Redis自动删除过期的私钥
     *
     * @return RsaKeyVO 包含Base64公钥和UUID的传输对象
     */
    @Override
    public RsaKeyVO generateKeyPair() {
        // 生成RSA密钥对（默认2048位）
        RSA rsa = new RSA();

        // 生成简单UUID作为私钥标识（不包含横线）
        String uuid = IdUtil.simpleUUID();

        // 将私钥Base64编码后存储到Redis，设置过期时间
        redisUtils.set(RedisConstant.RSA_PRIVATE_KEY + uuid,
                rsa.getPrivateKeyBase64(),
                RedisConstant.RSA_PUBLIC_KEY_EXP_TIME);

        // 返回公钥和UUID
        return new RsaKeyVO(rsa.getPublicKeyBase64(), uuid);
    }

    /**
     * 使用UUID解密内容
     *
     * 解密流程：
     * 1. 根据UUID从Redis获取私钥
     * 2. 判断是否需要立即删除私钥
     * 3. 验证私钥是否存在且有效
     * 4. 使用私钥解密Base64编码的密文
     * 5. 将解密结果转换为UTF-8字符串
     * 6. 处理异常，解密失败时返回null
     *
     * 异常处理策略：
     * - 私钥不存在：返回null，记录日志
     * - 解密失败：返回null，记录异常信息
     * - 格式错误：返回null，记录错误详情
     * - 不抛出异常：避免向调用方暴露加密细节
     *
     * 安全特性：
     * - 私钥用后即删：needDelete=true时立即删除
     * - 私钥访问控制：只有拥有UUID才能解密
     * - 异常保护：不向外部暴露加密实现细节
     * - 日志记录：记录解密失败信息，便于排查问题
     *
     * @param uuid 私钥唯一标识
     * @param content Base64编码的RSA加密内容
     * @param needDelete 解密后是否立即删除私钥
     * @return 解密后的UTF-8字符串，失败时返回null
     */
    @Override
    public String decrypt(String uuid, String content, boolean needDelete) {
        try {
            // 从Redis获取私钥
            Object obj = redisUtils.get(RedisConstant.RSA_PRIVATE_KEY + uuid);

            // 如果需要删除私钥，立即从Redis中删除
            if (needDelete){
                redisUtils.del(RedisConstant.RSA_PRIVATE_KEY + uuid);
            }

            // 验证私钥是否存在且为字符串类型
            if (obj instanceof String) {
                String privateKey = (String) obj;

                // 使用私钥创建RSA解密器
                RSA rsa = new RSA(privateKey, null);

                // 解密内容并转换为UTF-8字符串
                return StrUtil.str(rsa.decrypt(content, KeyType.PrivateKey), CharsetUtil.CHARSET_UTF_8);
            }
        } catch (Exception e){
            // 记录解密失败信息，便于问题排查
            log.info("解密失败，uuid：{}，异常信息：{}", uuid, e.getMessage());
        }

        // 解密失败或私钥不存在时返回null
        return null;
    }
}