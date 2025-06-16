package top.zway.fic.base.constant;

/**
 * 用户角色常量类
 * 
 * 作用说明：
 * 1. 定义系统中的用户角色类型
 * 2. 支持基于角色的权限控制（RBAC）
 * 3. 便于权限判断和用户状态管理
 * 
 * 权限体系设计：
 * - 角色用于标识用户的身份和权限级别
 * - 每个角色对应不同的功能访问权限
 * - 支持多角色用户和角色升级机制
 * 
 * 扩展性考虑：
 * - 可根据业务需要添加新的角色类型
 * - 支持角色继承和权限组合
 * - 便于实现细粒度的权限控制
 * 
 * @author hardcore-cards
 * @since 1.0
 */
public class RoleConstant {
    
    /**
     * 评估期用户角色
     * 
     * 角色说明：
     * - 新注册用户的默认角色
     * - 具有基础功能的试用权限
     * - 在评估期内验证用户的使用情况
     * 
     * 权限特点：
     * - 可以创建和使用看板（数量可能有限制）
     * - 可以邀请少量用户协作
     * - 部分高级功能可能受限
     * - 存储空间可能有限制
     * 
     * 使用场景：
     * - 用户刚注册时自动分配此角色
     * - 免费试用期的权限控制
     * - 防止恶意用户大量占用系统资源
     * 
     * 升级条件：
     * - 使用时间达到一定期限
     * - 活跃度达到要求
     * - 或者付费升级为正式用户
     * 
     * 数据库映射：role表中role_name字段值为"evaluation"
     */
    public static final String EVALUATION = "evaluation";
    
    /**
     * 正式注册用户角色
     * 
     * 角色说明：
     * - 通过评估期或直接注册的正式用户
     * - 拥有完整的系统功能权限
     * - 系统的主要用户群体
     * 
     * 权限特点：
     * - 无限制创建和管理看板
     * - 不限制邀请协作用户数量
     * - 可以使用所有基础和高级功能
     * - 拥有更大的存储空间配额
     * - 可以导出数据和使用API
     * 
     * 使用场景：
     * - 评估期用户的升级目标
     * - 付费用户或认证用户
     * - 企业内部用户的标准角色
     * 
     * 特殊权限：
     * - 可以创建团队和组织
     * - 可以管理团队成员权限
     * - 可以使用高级搜索和统计功能
     * 
     * 数据库映射：role表中role_name字段值为"registered"
     */
    public static final String REGISTERED = "registered";
    
    // ==================== 扩展预留 ====================
    /*
     * 未来可能扩展的角色类型：
     * 
     * public static final String ADMIN = "admin";           // 系统管理员
     * public static final String MODERATOR = "moderator";   // 版主/协调员  
     * public static final String VIP = "vip";               // VIP用户
     * public static final String ENTERPRISE = "enterprise"; // 企业用户
     * public static final String GUEST = "guest";           // 访客用户
     * 
     * 角色权限层次结构（由低到高）：
     * GUEST < EVALUATION < REGISTERED < VIP < MODERATOR < ADMIN
     */
}
