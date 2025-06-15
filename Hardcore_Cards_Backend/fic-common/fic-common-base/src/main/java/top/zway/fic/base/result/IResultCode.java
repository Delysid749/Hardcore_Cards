package top.zway.fic.base.result;
/**
 * 响应状态码接口
 *
 * 设计原理：
 * 1. 接口设计模式：定义统一的状态码规范
 * 2. 策略模式：不同的实现类代表不同的状态码策略
 * 3. 可扩展性：业务模块可以实现此接口定义自己的状态码
 */
public interface IResultCode {
    /**
     * 获取状态码
     * @return 状态码字符串
     */
    String getCode();


    /**
     * 获取状态描述
     * @return 状态描述信息
     */
    String getMsg();
}
