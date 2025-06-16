package top.zway.fic.base.constant;

import java.util.regex.Pattern;

/**
 * 正则表达式常量类
 * 
 * 作用说明：
 * 1. 定义系统中常用的正则表达式模式
 * 2. 预编译正则表达式，提升性能
 * 3. 统一管理校验规则，保证一致性
 * 
 * 设计原理：
 * - 使用Pattern.compile()预编译正则表达式
 * - 避免运行时重复编译，提升匹配效率
 * - 提供标准的格式校验规则
 * 
 * 性能优势：
 * - 预编译的Pattern对象可重复使用
 * - 避免每次校验时重新解析正则表达式
 * - 在高并发场景下性能表现更好
 * 
 * @author hardcore-cards
 * @since 1.0
 */
public class RegexConstant {
    
    /**
     * 邮箱地址校验正则表达式（预编译）
     * 
     * 正则解析：
     * ^([a-zA-Z0-9]+[_|_|\\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,6}$
     * 
     * 规则说明：
     * 1. ^ - 匹配字符串开始
     * 2. ([a-zA-Z0-9]+[_|_|\\-|.]?)* - 用户名部分
     *    - [a-zA-Z0-9]+ : 至少一个字母或数字
     *    - [_|_|\\-|.]? : 可选的特殊字符（下划线、中划线、点）
     *    - * : 上述模式可重复多次
     * 3. [a-zA-Z0-9]+ - 用户名必须以字母或数字结尾
     * 4. @ - 必须包含@符号
     * 5. ([a-zA-Z0-9]+[_|_|.]?)* - 域名主体部分
     * 6. [a-zA-Z0-9]+ - 域名主体必须以字母或数字结尾
     * 7. \\. - 必须包含点号（转义）
     * 8. [a-zA-Z]{2,6} - 顶级域名，2-6位字母
     * 9. $ - 匹配字符串结束
     * 
     * 支持的邮箱格式示例：
     * ✅ user@example.com
     * ✅ user.name@example.com
     * ✅ user_name@example.co.uk
     * ✅ user-name@sub.example.org
     * ✅ 123user@example.net
     * 
     * 不支持的格式示例：
     * ❌ user@example (缺少顶级域名)
     * ❌ @example.com (缺少用户名)
     * ❌ user@.com (域名格式错误)
     * ❌ user..name@example.com (连续点号)
     * 
     * 使用方式：
     * boolean isValid = RegexConstant.EMAIL_REGEX.matcher(email).matches();
     * 
     * 性能特点：
     * - Pattern对象线程安全，可并发使用
     * - 预编译避免重复解析开销
     * - 适合高频邮箱校验场景
     */
    public static final Pattern EMAIL_REGEX = Pattern.compile("^([a-zA-Z0-9]+[_|_|\\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,6}$");
}
