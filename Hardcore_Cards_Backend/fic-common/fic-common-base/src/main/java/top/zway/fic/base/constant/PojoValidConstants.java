package top.zway.fic.base.constant;

/**
 * POJO校验常量类
 * 
 * 作用说明：
 * 1. 定义各种业务实体的字段长度限制
 * 2. 配合JSR303校验注解使用，如@Size、@Range等
 * 3. 统一管理校验规则，便于维护和修改
 * 
 * 使用场景：
 * - 在DTO类中定义@Size(max = PojoValidConstants.KANBAN_TITLE_MAX_LEN)
 * - 在前端表单验证中保持一致的长度限制
 * - 数据库字段长度设计参考
 * 
 * @author hardcore-cards
 * @since 1.0
 */
public class PojoValidConstants {
    
    // ==================== 用户相关校验常量 ====================
    
    /**
     * 用户密码最小长度限制
     * 用于：用户注册、修改密码时的校验
     * 设计原理：保证密码复杂度，增强安全性
     */
    public static final int PASSWORD_MIN_LEN = 6;
    
    /**
     * 用户密码最大长度限制  
     * 用于：防止过长密码导致的性能问题
     * 设计原理：平衡安全性和用户体验
     */
    public static final int PASSWORD_MAX_LEN = 50;

    // ==================== 看板相关校验常量 ====================
    
    /**
     * 看板标题最大长度限制
     * 用于：创建看板、修改看板标题时的校验
     * 设计原理：保证标题简洁明了，避免显示问题
     */
    public static final int KANBAN_TITLE_MAX_LEN = 80;
    
    /**
     * 看板类型最大值
     * 用于：看板类型枚举值校验
     * 当前支持类型：1-普通看板
     */
    public static final int KANBAN_TYPE_MAX_VALUE = 1;
    
    /**
     * 看板类型最小值
     * 用于：看板类型枚举值校验  
     * 当前支持类型：1-普通看板
     */
    public static final int KANBAN_TYPE_MIN_VALUE = 1;

    // ==================== 列相关校验常量 ====================
    
    /**
     * 看板列标题最大长度限制
     * 用于：创建列、修改列标题时的校验
     * 设计原理：列标题要简短，便于看板界面展示
     */
    public static final int COLUMN_TITLE_MAX_LEN = 30;

    // ==================== 卡片相关校验常量 ====================
    
    /**
     * 卡片内容最大长度限制
     * 用于：创建卡片、编辑卡片内容时的校验
     * 设计原理：卡片内容要相对简洁，避免界面过于拥挤
     */
    public static final int CARD_CONTEXT_MAX_LEN = 250;

    // ==================== 标签相关校验常量 ====================
    
    /**
     * 标签内容最大长度限制
     * 用于：创建标签、编辑标签内容时的校验
     * 设计原理：标签要简短精炼，便于快速识别
     */
    public static final int TAG_CONTEXT_MAX_LEN = 15;
}
