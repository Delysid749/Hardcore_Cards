package top.zway.fic.web.exception;

import top.zway.fic.base.result.IResultCode;

public class BizException extends RuntimeException {

    public BizException() {
    }

    public BizException(String message) {
        super(message);
    }
}
