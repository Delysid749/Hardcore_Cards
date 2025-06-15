package top.zway.fic.base.result;

import cn.hutool.core.util.StrUtil;
import lombok.Data;

import java.io.Serializable;

/**
 * 统一响应结果封装类
 * 
 * 设计原理：
 * 1. 泛型设计：T 表示返回数据的类型，提供类型安全
 * 2. 建造者模式：通过静态方法链式调用，代码更优雅
 * 3. 序列化支持：实现Serializable，支持Redis缓存等场景
 * 4. 统一结构：所有API返回相同格式，前端处理简单统一
 * 
 * JSON格式示例：
 * {
 *   "code": "000",
 *   "msg": "操作成功", 
 *   "data": {...},
 *   "total": 100
 * }
 */
@Data
public class R<T> implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    /**
     * 状态码
     */
    private String code;
    
    /**
     * 响应消息
     */
    private String msg;
    
    /**
     * 响应数据
     */
    private T data;
    
    /**
     * 总数（用于分页）
     */
    private Integer total;
    
    /**
     * 私有构造函数，防止外部直接实例化
     * 强制使用静态工厂方法创建实例
     */
    private R() {
    }
    
    /**
     * 设置响应状态码和消息
     * 
     * @param resultCode 状态码枚举
     */
    private void setResultCode(IResultCode resultCode) {
        this.code = resultCode.getCode();
        this.msg = resultCode.getMsg();
    }
    
    /**
     * 通用结果构建方法
     * 
     * @param resultCode 状态码
     * @param message 自定义消息（可选）
     * @param data 响应数据
     * @param total 总数
     * @return 响应结果
     */
    public static <T> R<T> result(IResultCode resultCode, String message, T data, Integer total) {
        R<T> result = new R<>();
        result.setResultCode(resultCode);
        
        // 如果提供了自定义消息，则覆盖默认消息
        if (StrUtil.isNotBlank(message)) {
            result.setMsg(message);
        }
        
        result.setData(data);
        result.setTotal(total);
        return result;
    }
    
    // ========== 成功响应静态工厂方法 ==========
    
    /**
     * 成功响应（带数据和总数）
     */
    public static <T> R<T> success(T data, Integer total) {
        return result(ResultCode.SUCCESS, null, data, total);
    }
    
    /**
     * 成功响应（仅带数据）
     */
    public static <T> R<T> success(T data) {
        return success(data, null);
    }
    
    /**
     * 成功响应（无数据）
     */
    public static <T> R<T> success() {
        return success(null, null);
    }
    
    /**
     * 成功响应（自定义消息）
     */
    public static <T> R<T> success(String message) {
        return result(ResultCode.SUCCESS, message, null, null);
    }
    
    // ========== 失败响应静态工厂方法 ==========
    
    /**
     * 失败响应（自定义消息）
     */
    public static <T> R<T> failed(String message) {
        return result(ResultCode.BUSINESS_FAILED, message, null, null);
    }
    
    /**
     * 失败响应（指定状态码）
     */
    public static <T> R<T> failed(IResultCode resultCode) {
        return result(resultCode, null, null, null);
    }
    
    /**
     * 失败响应（指定状态码和自定义消息）
     */
    public static <T> R<T> failed(IResultCode resultCode, String message) {
        return result(resultCode, message, null, null);
    }
    
    /**
     * 失败响应（默认业务失败）
     */
    public static <T> R<T> failed() {
        return failed(ResultCode.BUSINESS_FAILED);
    }
    
    // ========== 条件响应静态工厂方法 ==========
    
    /**
     * 根据布尔值判断成功或失败
     * 
     * @param success 是否成功
     * @return 响应结果
     */
    public static <T> R<T> judge(boolean success) {
        return success ? success() : failed();
    }
    
    /**
     * 根据布尔值判断成功或失败（自定义失败消息）
     * 
     * @param success 是否成功
     * @param failedMessage 失败时的消息
     * @return 响应结果
     */
    public static <T> R<T> judge(boolean success, String failedMessage) {
        return success ? success() : failed(failedMessage);
    }
    
    /**
     * 根据布尔值判断成功或失败（自定义失败状态码）
     * 
     * @param success 是否成功
     * @param failedCode 失败时的状态码
     * @return 响应结果
     */
    public static <T> R<T> judge(boolean success, IResultCode failedCode) {
        return success ? success() : failed(failedCode);
    }
    
    // ========== 便捷判断方法 ==========
    
    /**
     * 判断是否成功
     */
    public boolean isSuccess() {
        return ResultCode.SUCCESS.getCode().equals(this.code);
    }
    
    /**
     * 判断是否失败
     */
    public boolean isFailed() {
        return !isSuccess();
    }
}