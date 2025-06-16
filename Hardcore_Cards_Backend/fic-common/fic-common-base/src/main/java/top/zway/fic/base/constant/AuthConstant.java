package top.zway.fic.base.constant;

/**
 * 认证授权常量类
 * 
 * 作用说明：
 * 1. 定义JWT Token的相关配置参数
 * 2. 统一管理认证授权过程中的常量
 * 3. 提供Token处理的标准规范
 * 
 * 技术架构：
 * - 基于JWT（JSON Web Token）的无状态认证
 * - 支持Access Token + Refresh Token双Token机制
 * - 集成RSA加密保护用户密码传输
 * 
 * 安全设计：
 * - Token有效期控制，防止长期有效的安全风险
 * - 权限标识规范化，便于权限管理
 * - 密码加密传输，防止明文密码泄露
 * 
 * @author hardcore-cards
 * @since 1.0
 */
public class AuthConstant {
    
    // ==================== HTTP请求头相关 ====================
    
    /**
     * 认证请求头的Key名称
     * 
     * 用途：HTTP请求头中携带Token的字段名
     * 标准：遵循OAuth2.0和JWT标准
     * 
     * 使用示例：
     * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     */
    public static final String AUTHORIZATION_HEADER_KEY = "Authorization";

    /**
     * Token请求头的值前缀
     * 
     * 用途：标识Token类型，符合Bearer Token规范
     * 格式：Bearer + 空格 + 实际Token值
     * 标准：遵循RFC6750 Bearer Token规范
     * 
     * 完整格式：Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     */
    public static final String TOKEN_REQUEST_HEADER_START_WITH = "Bearer ";

    // ==================== 权限角色相关 ====================
    
    /**
     * 权限角色的前缀
     * 
     * 用途：统一权限角色的命名规范
     * 作用：便于Spring Security进行角色识别和权限判断
     * 
     * 示例：
     * - ROLE_USER：普通用户角色
     * - ROLE_ADMIN：管理员角色
     * - ROLE_MODERATOR：版主角色
     */
    public static final String AUTHORITY_PREFIX = "ROLE_";

    /**
     * JWT Token中权限声明的字段名
     * 
     * 用途：在JWT Token的payload中存储用户权限信息
     * 结构：Token解析后可通过此字段获取用户的角色权限列表
     * 
     * Token示例结构：
     * {
     *   "sub": "user123",
     *   "authorities": ["ROLE_USER", "ROLE_VIP"],
     *   "exp": 1234567890
     * }
     */
    public static final String AUTHORITY_CLAIM_NAME = "authorities";

    // ==================== Token有效期配置 ====================
    
    /**
     * 访问Token的有效期（秒）
     * 
     * 时间：2小时
     * 设计原理：
     * - 足够用户正常使用，减少频繁刷新Token的困扰
     * - 不会过长，降低Token被盗用的安全风险
     * - 配合Refresh Token实现长期登录状态
     * 
     * 使用场景：
     * - 用户日常操作的身份验证
     * - API接口调用的权限验证
     */
    public static final int ACCESS_TOKEN_VALIDITY_SECONDS = 60 * 60 * 2;

    /**
     * 刷新Token的有效期（秒）
     * 
     * 时间：7天
     * 设计原理：
     * - 允许用户长期保持登录状态
     * - 定期更换Token，保证安全性
     * - 平衡用户体验和系统安全
     * 
     * 使用场景：
     * - 用户关闭应用后重新打开时自动登录
     * - Access Token过期时自动刷新
     */
    public static final int REFRESH_TOKEN_VALIDITY_SECONDS = 60 * 60 * 24 * 7;

    // ==================== 登录验证相关 ====================
    
    /**
     * 验证码在请求中的参数名
     * 
     * 用途：用户登录时需要输入的图形验证码字段名
     * 作用：防止暴力破解和自动化攻击
     * 
     * 使用示例：
     * POST /login
     * {
     *   "username": "user123",
     *   "password": "encrypted_password",
     *   "captcha": "ABCD"
     * }
     */
    public static final String CAPTCHA_CODE_KEY = "captcha";

    /**
     * RSA密钥UUID在请求中的参数名
     * 
     * 用途：标识客户端使用的RSA公钥
     * 作用：服务端根据此UUID找到对应的私钥来解密密码
     * 
     * 工作流程：
     * 1. 客户端获取RSA公钥和UUID
     * 2. 使用公钥加密密码
     * 3. 将加密密码和UUID一起发送
     * 4. 服务端根据UUID找到私钥解密
     */
    public static final String RSA_UUID_KEY = "rsa_uuid";

    /**
     * 密码在请求中的参数名
     * 
     * 用途：用户登录时密码字段的标准名称
     * 特点：密码经过RSA加密后传输，保证安全性
     * 
     * 安全流程：
     * 1. 前端使用RSA公钥加密密码
     * 2. 传输加密后的密码字符串
     * 3. 后端使用私钥解密得到原始密码
     */
    public static final String PASSWORD_KEY = "password";

    // ==================== OAuth2相关 ====================
    
    /**
     * OAuth2授权类型的参数名
     * 
     * 用途：标识OAuth2的授权方式
     * 标准：遵循OAuth2.0规范
     * 
     * 支持的授权类型：
     * - password：用户名密码授权
     * - refresh_token：刷新Token授权
     * - authorization_code：授权码授权
     */
    public static final String GRANT_TYPE = "grant_type";

    /**
     * 密码授权类型的值
     * 
     * 用途：用户名密码登录时的grant_type值
     * 场景：用户使用用户名+密码进行登录认证
     * 
     * 请求示例：
     * POST /oauth/token
     * {
     *   "grant_type": "password",
     *   "username": "user123",
     *   "password": "encrypted_password"
     * }
     */
    public static final String GRANT_TYPE_PASSWORD = "password";
}
