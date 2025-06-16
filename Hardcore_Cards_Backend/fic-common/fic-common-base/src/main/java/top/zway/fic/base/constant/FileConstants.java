package top.zway.fic.base.constant;

import java.util.Arrays;
import java.util.List;

/**
 * 文件相关常量类
 * 
 * 作用说明：
 * 1. 定义文件上传时允许的文件类型
 * 2. 保证系统安全性，防止恶意文件上传
 * 3. 统一管理文件格式限制，便于扩展和维护
 * 
 * 使用场景：
 * - 用户头像上传时的格式校验
 * - 看板背景图片上传限制
 * - 卡片附件上传格式控制
 * 
 * 安全考虑：
 * - 只允许常见的图片格式，避免可执行文件上传
 * - 防止通过文件上传进行系统攻击
 * 
 * @author hardcore-cards
 * @since 1.0
 */
public class FileConstants {
    
    /**
     * 允许上传的文件后缀名列表
     * 
     * 支持的图片格式：
     * - jpg: JPEG格式图片，压缩比高，适合照片
     * - png: PNG格式图片，支持透明背景，适合图标
     * - jpeg: JPEG格式的另一种扩展名
     * - gif: GIF格式图片，支持动画效果
     * 
     * 使用方式：
     * if (FileConstants.ALLOW_SUFFIX.contains(fileSuffix.toLowerCase())) {
     *     // 允许上传
     * }
     */
    public static final List<String> ALLOW_SUFFIX = Arrays.asList("jpg", "png", "jpeg", "gif");
}
