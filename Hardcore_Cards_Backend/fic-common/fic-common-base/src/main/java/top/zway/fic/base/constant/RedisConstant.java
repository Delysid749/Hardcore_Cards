package top.zway.fic.base.constant;

/**
 * Redis缓存常量类
 * 
 * 作用说明：
 * 1. 定义Redis中各种缓存的Key前缀和命名规范
 * 2. 统一管理缓存过期时间，避免硬编码
 * 3. 提供缓存Key的标准格式，便于维护和调试
 * 
 * 命名规范：
 * - 使用冒号(:)分隔不同层级
 * - 使用下划线(_)连接同层级的单词
 * - 格式：模块:功能:具体标识
 * 
 * 使用场景：
 * - 用户会话管理
 * - 看板数据缓存
 * - 权限信息缓存
 * - 验证码临时存储
 * 
 * @author hardcore-cards
 * @since 1.0
 */
public class RedisConstant {

    // ==================== 权限认证相关缓存 ====================
    
    /**
     * 资源角色映射缓存Key
     * 
     * 作用：缓存URL路径与所需角色的映射关系
     * 使用场景：网关权限校验时快速查找接口所需权限
     * 数据结构：Hash，key为URL路径，value为角色列表
     * 
     * 示例：AUTH:RESOURCE_ROLES_MAP -> {"/api/kanban": ["ROLE_USER"]}
     */
    public static final String RESOURCE_ROLES_MAP = "AUTH:RESOURCE_ROLES_MAP";

    // ==================== 看板缓存相关 ====================
    
    /**
     * 看板内容缓存Key前缀
     * 
     * 作用：缓存看板的完整数据（包含列和卡片）
     * 完整Key格式：CACHE:KANBAN_{kanbanId}
     * 使用场景：用户访问看板时减少数据库查询
     * 
     * 示例：CACHE:KANBAN_123 -> 看板123的完整数据
     */
    public static final String KANBAN_CACHE = "CACHE:KANBAN_";

    /**
     * 看板缓存过期时间（秒）
     * 
     * 时间：5分钟
     * 设计原理：平衡数据实时性和缓存效果
     * - 不会太长导致数据过期
     * - 不会太短失去缓存意义
     */
    public static final long KANBAN_CACHE_EXPIRE_SECOND = 300L;

    // ==================== 协作状态统计相关 ====================
    
    /**
     * 看板协作状态统计Key前缀
     * 
     * 作用：统计当前有多少用户正在协作编辑某个看板
     * 完整Key格式：STATISTIC:COOPERATING_KANBAN_{kanbanId}
     * 使用场景：显示看板当前协作人数，防止编辑冲突
     * 
     * 示例：STATISTIC:COOPERATING_KANBAN_123 -> Set<userId>
     */
    public static final String COOPERATING_KANBAN_STATISTIC = "STATISTIC:COOPERATING_KANBAN_";

    /**
     * 看板协作状态统计过期时间（秒）
     * 
     * 时间：5分钟
     * 设计原理：用户活跃状态的合理超时时间
     * - 用户关闭页面后不会立即清除，允许短暂离开
     * - 不会过长导致虚假的协作状态显示
     */
    public static final long COOPERATING_KANBAN_STATISTIC_EXPIRE_SECOND = 300L;

    // ==================== 定时更新相关 ====================
    
    /**
     * 看板全量更新定时器Key前缀
     * 
     * 作用：防止看板数据的重复全量更新操作
     * 完整Key格式：TIMER:KANBAN_FULL_UPDATE_{kanbanId}
     * 使用场景：当看板有大量变更时，避免频繁的全量更新
     * 
     * 工作原理：
     * 1. 发起全量更新时设置此Key
     * 2. Key存在期间忽略其他全量更新请求
     * 3. Key过期后允许下一次全量更新
     */
    public static final String KANBAN_FULL_UPDATE_TIMER_PREFIX = "TIMER:KANBAN_FULL_UPDATE_";

    /**
     * 看板全量更新定时器过期时间（秒）
     * 
     * 时间：20分钟
     * 设计原理：平衡系统性能和数据一致性
     * - 避免短时间内重复全量更新
     * - 确保数据最终一致性
     */
    public static final long KANBAN_FULL_UPDATE_TIMER_EXP_TIME = 60 * 20;

    // ==================== 安全认证相关 ====================
    
    /**
     * RSA私钥缓存Key前缀
     * 
     * 作用：缓存用于密码加密的RSA私钥
     * 完整Key格式：RSA:PRIVATE_KEY_{uuid}
     * 使用场景：用户登录时密码解密
     * 
     * 安全考虑：
     * - 私钥有时效性，定期更换
     * - 每个会话使用独立的密钥对
     */
    public static final String RSA_PRIVATE_KEY = "RSA:PRIVATE_KEY_";

    /**
     * RSA公钥过期时间（秒）
     * 
     * 时间：10分钟
     * 设计原理：安全性和用户体验的平衡
     * - 足够用户完成登录流程
     * - 不会长期占用缓存资源
     */
    public static final long RSA_PUBLIC_KEY_EXP_TIME = 60 * 10;

    // ==================== 邮件验证相关 ====================
    
    /**
     * 邮箱验证码缓存Key前缀
     * 
     * 作用：存储发送给用户的邮箱验证码
     * 完整Key格式：VERIFICATION_CODE:EMAIL_{email}
     * 使用场景：用户注册、找回密码时的邮箱验证
     * 
     * 示例：VERIFICATION_CODE:EMAIL_user@example.com -> "123456"
     */
    public static final String EMAIL_VERIFICATION_CODE_PREFIX = "VERIFICATION_CODE:EMAIL_";

    /**
     * 邮箱验证码过期时间（秒）
     * 
     * 时间：11分钟
     * 设计原理：给用户充足时间查看邮件并输入验证码
     * - 考虑邮件发送延迟
     * - 不会过长导致安全风险
     */
    public static final long EMAIL_VERIFICATION_CODE_EXP_TIME = 60 * 10 + 60;

    /**
     * 邮箱验证码发送间隔（毫秒）
     * 
     * 时间：1分钟
     * 设计原理：防止验证码接口被滥用
     * - 避免恶意用户频繁发送验证码
     * - 减轻邮件服务器压力
     * - 提升用户体验（避免短时间收到多个验证码）
     */
    public static final long EMAIL_VERIFICATION_CODE_SEND_INTERVAL_MILLISECOND = 60 * 1000;
}