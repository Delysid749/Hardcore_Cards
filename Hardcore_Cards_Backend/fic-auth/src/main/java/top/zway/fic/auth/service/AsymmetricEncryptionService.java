package top.zway.fic.auth.service;

import top.zway.fic.base.entity.VO.RsaKeyVO;

/**
 * 非对称加密服务接口
 *
 * 核心功能：
 * 1. RSA密钥对的生成和管理
 * 2. 基于UUID的密钥存储和检索机制
 * 3. 安全的数据加密和解密服务
 *
 * 设计原理：
 * - 每次生成全新的密钥对，避免密钥重用的安全风险
 * - 私钥临时存储在Redis中，设置合理的过期时间
 * - 通过UUID作为密钥标识，实现密钥的安全管理
 * - 支持一次性使用模式，解密后立即删除私钥
 *
 * 安全考虑：
 * - 公钥可以公开传输，用于数据加密
 * - 私钥严格保密，仅用于数据解密
 * - 密钥对具有时效性，防止长期存储带来的风险
 * - 支持密钥的主动销毁，减少内存中的敏感信息
 */
public interface AsymmetricEncryptionService {

    /**
     * 生成RSA密钥对
     *
     * 功能描述：
     * 1. 生成新的RSA密钥对（推荐2048位）
     * 2. 将私钥Base64编码后存储到Redis
     * 3. 为私钥生成唯一的UUID标识
     * 4. 设置私钥的过期时间，自动清理
     * 5. 返回公钥和UUID给调用方
     *
     * 使用场景：
     * - 用户登录前，前端调用此方法获取加密公钥
     * - 敏感数据传输前，系统生成临时加密密钥
     * - 微服务间安全通信的密钥协商
     *
     * 返回对象包含：
     * - publicKey: Base64编码的RSA公钥
     * - uuid: 私钥的唯一标识，用于后续解密操作
     *
     * @return RsaKeyVO 包含公钥和UUID的数据传输对象
     */
    RsaKeyVO generateKeyPair();

    /**
     * 使用UUID解密内容
     *
     * 功能描述：
     * 1. 根据UUID从Redis中获取对应的私钥
     * 2. 使用私钥解密Base64编码的加密内容
     * 3. 根据needDelete参数决定是否删除私钥
     * 4. 返回解密后的明文字符串
     *
     * 参数说明：
     * - uuid: 私钥标识，由generateKeyPair方法返回
     * - content: Base64编码的RSA加密内容
     * - needDelete: 解密后是否删除私钥
     *   * true: 一次性使用，解密后立即删除私钥（推荐）
     *   * false: 保留私钥，直到Redis过期时间到达
     *
     * 安全特性：
     * - 解密操作有完整的异常处理
     * - 支持私钥的立即销毁
     * - 解密失败时返回null，不抛出异常
     * - 私钥不存在或已过期时自动处理
     *
     * 使用场景：
     * - 解密用户登录密码
     * - 解密API请求中的敏感参数
     * - 微服务间加密数据的解密
     *
     * @param uuid 私钥唯一标识
     * @param content Base64编码的加密内容
     * @param needDelete 解密后是否删除私钥
     * @return 解密后的明文字符串，解密失败时返回null
     */
    String decrypt(String uuid, String content, boolean needDelete);
}