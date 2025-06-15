package top.zway.fic.base.exception;

import top.zway.fic.base.result.IResultCode;
import top.zway.fic.base.result.ResultCode;

public class BizException extends RuntimeException{
    private static final long serialVersionUID = 1L;

    /*
    错误码
     */
    private IResultCode resultCode;

    /**
     * 构造函数 - 使用错误码
     *
     * @param resultCode 错误码枚举
     */
    public BizException(IResultCode resultCode){
        super(resultCode.getMsg());
        this.resultCode = resultCode;
    }

    /**
     * 构造函数 - 使用错误码和自定义消息
     *
     * @param resultCode 错误码枚举
     * @param message 自定义错误消息
     */
    public BizException(IResultCode resultCode,String message){
        super(message);
        this.resultCode = resultCode;
    }

    /**
     * 构造函数 - 使用错误码、自定义消息和原因
     *
     * @param resultCode 错误码枚举
     * @param message 自定义错误消息
     * @param cause 异常原因
     */
    public BizException(IResultCode resultCode,String message,Throwable cause){
        super(message,cause);
        this.resultCode = resultCode;
    }

    /**
     * 构造函数 - 仅使用自定义消息（默认业务失败错误码）
     *
     * @param message 错误消息
     */
    public BizException(String message){
        super(message);
        this.resultCode = ResultCode.BUSINESS_FAILED;
    }

    /**
     * 构造函数 - 使用自定义消息和原因（默认业务失败错误码）
     *
     * @param message 错误消息
     * @param cause 异常原因
     */
    public BizException(String message,Throwable cause){
        super(message,cause);
        this.resultCode = ResultCode.BUSINESS_FAILED;
    }

    /**
     * 获取错误码
     */
    public IResultCode getResultCode(){
        return resultCode;
    }

//    静态工厂方法
    /**
     * 抛出业务异常 - 使用错误码
     */
    public static void throwBiz(IResultCode resultCode){
        throw new BizException(resultCode);
    }

    /**
     * 抛出业务异常 - 使用错误码和自定义消息
     */
    public static void throwBiz(IResultCode resultCode, String message) {
        throw new BizException(resultCode, message);
    }

    /**
     * 抛出业务异常 - 仅使用自定义消息
     */
    public static void throwBiz(String message) {
        throw new BizException(message);
    }

    /**
     * 条件抛出异常 - 当条件为true时抛出
     */
    public static void throwIf(boolean condition, IResultCode resultCode) {
        if (condition) {
            throw new BizException(resultCode);
        }
    }

    /**
     * 条件抛出异常 - 当条件为true时抛出（自定义消息）
     */
    public static void throwIf(boolean condition, IResultCode resultCode, String message) {
        if (condition) {
            throw new BizException(resultCode, message);
        }
    }

    /**
     * 条件抛出异常 - 当条件为true时抛出（仅消息）
     */
    public static void throwIf(boolean condition, String message) {
        if (condition) {
            throw new BizException(message);
        }
    }

    /**
     * 断言不为空 - 为空时抛出异常
     */
    public static void assertNotNull(Object obj, IResultCode resultCode) {
        throwIf(obj == null, resultCode);
    }

    /**
     * 断言不为空 - 为空时抛出异常（自定义消息）
     */
    public static void assertNotNull(Object obj, String message) {
        throwIf(obj == null, message);
    }

    /**
     * 断言为真 - 为假时抛出异常
     */
    public static void assertTrue(boolean condition, IResultCode resultCode) {
        throwIf(!condition, resultCode);
    }

    /**
     * 断言为真 - 为假时抛出异常（自定义消息）
     */
    public static void assertTrue(boolean condition, String message) {
        throwIf(!condition, message);
    }




}
