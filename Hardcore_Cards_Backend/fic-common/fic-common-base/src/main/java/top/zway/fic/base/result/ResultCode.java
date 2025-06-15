package top.zway.fic.base.result;

/**
 * 通用响应状态码枚举
 *
 * 设计原理：
 * 1. 枚举单例模式：保证状态码的唯一性和不可变性
 * 2. 分类编码设计：
 *    - 000：成功状态
 *    - A4xx：认证授权相关错误
 *    - B5xx：业务逻辑错误
 *    - C5xx：系统内部错误
 * 3. 国际化支持：msg可以支持多语言
 */
public enum ResultCode implements IResultCode {

    // ========== 成功状态 ==========
    SUCCESS("000", "操作成功"),

    // ========== 客户端错误 4xx ==========
    BAD_REQUEST("400", "请求参数错误"),
    UNAUTHORIZED("A401", "未授权访问"),
    FORBIDDEN("A403", "访问被禁止"),
    NOT_FOUND("404", "资源不存在"),
    METHOD_NOT_ALLOWED("405", "请求方法不支持"),

    // ========== 业务错误 B5xx ==========
    BUSINESS_FAILED("B500", "业务处理失败"),
    USER_NOT_FOUND("B501", "用户不存在"),
    USERNAME_EXISTS("B502", "用户名已存在"),
    INVALID_PASSWORD("B503", "密码不正确"),
    KANBAN_NOT_FOUND("B504", "看板不存在"),
    KANBAN_ACCESS_DENIED("B505", "无权限访问该看板"),
    CARD_NOT_FOUND("B506", "卡片不存在"),
    COLUMN_NOT_FOUND("B507", "列不存在"),

    // ========== 系统错误 C5xx ==========
    INTERNAL_ERROR("C500", "系统内部错误"),
    DATABASE_ERROR("C501", "数据库操作失败"),
    NETWORK_ERROR("C502", "网络连接错误"),
    SERVICE_UNAVAILABLE("C503", "服务暂时不可用");

    private final String code;
    private final String msg;

    ResultCode(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getMsg() {
        return msg;
    }
}