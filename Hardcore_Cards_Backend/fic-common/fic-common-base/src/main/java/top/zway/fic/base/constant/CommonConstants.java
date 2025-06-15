package top.zway.fic.base.constant;

/**
 * 公共常量类
 *
 * 设计原理：
 * 1. 按功能分类：避免一个大而全的常量类
 * 2. 接口设计：使用接口定义常量，自动是public static final
 * 3. 命名规范：常量名全大写，用下划线分隔
 * 4. 分组管理：相关常量放在一起，便于维护
 */
public interface CommonConstants {

    // ========== 响应相关常量 ==========

    /**
     * 成功状态码
     */
    String SUCCESS_CODE = "000";

    /**
     * 默认成功消息
     */
    String SUCCESS_MSG = "操作成功";

    /**
     * 默认失败消息
     */
    String FAILED_MSG = "操作失败";

    // ========== 认证相关常量 ==========

    /**
     * JWT Token前缀
     */
    String TOKEN_PREFIX = "Bearer ";

    /**
     * Authorization请求头
     */
    String AUTHORIZATION_HEADER = "Authorization";

    /**
     * 用户ID请求头
     */
    String USER_ID_HEADER = "X-User-Id";

    /**
     * Token过期时间（秒）- 2小时
     */
    long ACCESS_TOKEN_EXPIRE_TIME = 2 * 60 * 60;

    /**
     * 刷新Token过期时间（秒）- 7天
     */
    long REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60;

    // ========== 缓存相关常量 ==========

    /**
     * 缓存Key分隔符
     */
    String CACHE_KEY_SEPARATOR = ":";

    /**
     * 用户信息缓存前缀
     */
    String CACHE_USER_PREFIX = "user:info:";

    /**
     * 看板信息缓存前缀
     */
    String CACHE_KANBAN_PREFIX = "kanban:info:";

    /**
     * 权限信息缓存前缀
     */
    String CACHE_PERMISSION_PREFIX = "permission:";

    /**
     * 默认缓存过期时间（秒）- 30分钟
     */
    long DEFAULT_CACHE_EXPIRE_TIME = 30 * 60;

    // ========== 分页相关常量 ==========

    /**
     * 默认页码
     */
    int DEFAULT_PAGE_NUM = 1;

    /**
     * 默认页大小
     */
    int DEFAULT_PAGE_SIZE = 10;

    /**
     * 最大页大小
     */
    int MAX_PAGE_SIZE = 100;

    // ========== 业务相关常量 ==========

    /**
     * 看板标题最大长度
     */
    int KANBAN_TITLE_MAX_LENGTH = 100;

    /**
     * 卡片内容最大长度
     */
    int CARD_CONTENT_MAX_LENGTH = 1000;

    /**
     * 列标题最大长度
     */
    int COLUMN_TITLE_MAX_LENGTH = 50;

    /**
     * 标签内容最大长度
     */
    int TAG_CONTENT_MAX_LENGTH = 20;

    /**
     * 用户昵称最大长度
     */
    int USER_NICKNAME_MAX_LENGTH = 50;

    // ========== 文件相关常量 ==========

    /**
     * 允许的图片文件类型
     */
    String[] ALLOWED_IMAGE_TYPES = {"jpg", "jpeg", "png", "gif", "webp"};

    /**
     * 头像文件最大大小（字节）- 2MB
     */
    long AVATAR_MAX_SIZE = 2 * 1024 * 1024;

    /**
     * 默认头像URL
     */
    String DEFAULT_AVATAR_URL = "/assets/images/default-avatar.png";

    // ========== 正则表达式常量 ==========

    /**
     * 用户名正则：4-20位字母数字下划线
     */
    String USERNAME_REGEX = "^[a-zA-Z0-9_]{4,20}$";

    /**
     * 密码正则：8-20位，至少包含字母和数字
     */
    String PASSWORD_REGEX = "^(?=.*[a-zA-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,20}$";

    /**
     * 邮箱正则
     */
    String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

    /**
     * 手机号正则
     */
    String PHONE_REGEX = "^1[3-9]\\d{9}$";

    /**
     * 颜色值正则：#开头的6位十六进制
     */
    String COLOR_REGEX = "^#[0-9A-Fa-f]{6}$";
}