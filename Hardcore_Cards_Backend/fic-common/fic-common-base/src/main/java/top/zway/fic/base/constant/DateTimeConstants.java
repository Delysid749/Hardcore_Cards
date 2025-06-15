package top.zway.fic.base.constant;

/**
 * 日期时间常量类
 *
 * 设计原理：
 * 1. 统一日期格式：避免项目中出现多种日期格式
 * 2. 时区管理：统一使用UTC+8时区
 * 3. 格式标准化：遵循ISO标准和常用格式
 */
public interface DateTimeConstants {

    // ========== 日期时间格式常量 ==========

    /**
     * 标准日期时间格式：yyyy-MM-dd HH:mm:ss
     */
    String STANDARD_DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    /**
     * 标准日期格式：yyyy-MM-dd
     */
    String STANDARD_DATE_FORMAT = "yyyy-MM-dd";

    /**
     * 标准时间格式：HH:mm:ss
     */
    String STANDARD_TIME_FORMAT = "HH:mm:ss";

    /**
     * ISO日期时间格式：yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
     */
    String ISO_DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";

    /**
     * 紧凑日期时间格式：yyyyMMddHHmmss
     */
    String COMPACT_DATETIME_FORMAT = "yyyyMMddHHmmss";

    /**
     * 中文日期时间格式：yyyy年MM月dd日 HH:mm:ss
     */
    String CHINESE_DATETIME_FORMAT = "yyyy年MM月dd日 HH:mm:ss";

    // ========== 时区常量 ==========

    /**
     * 系统默认时区：东八区
     */
    String DEFAULT_TIMEZONE = "GMT+8";

    /**
     * UTC时区
     */
    String UTC_TIMEZONE = "UTC";

    // ========== 时间单位常量（毫秒） ==========

    /**
     * 一秒的毫秒数
     */
    long SECOND_MILLIS = 1000L;

    /**
     * 一分钟的毫秒数
     */
    long MINUTE_MILLIS = 60 * SECOND_MILLIS;

    /**
     * 一小时的毫秒数
     */
    long HOUR_MILLIS = 60 * MINUTE_MILLIS;

    /**
     * 一天的毫秒数
     */
    long DAY_MILLIS = 24 * HOUR_MILLIS;

    /**
     * 一周的毫秒数
     */
    long WEEK_MILLIS = 7 * DAY_MILLIS;
}