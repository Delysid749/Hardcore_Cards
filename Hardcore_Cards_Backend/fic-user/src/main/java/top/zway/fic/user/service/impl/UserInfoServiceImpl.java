package top.zway.fic.user.service.impl;

import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import top.zway.fic.base.entity.DO.UserInfoDO;
import top.zway.fic.user.dao.UserInfoDao;
import top.zway.fic.user.service.UserInfoService;
import top.zway.fic.user.util.OssUtil;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserInfoServiceImpl implements UserInfoService {
    private final UserInfoDao userInfoDao;
    private final OssUtil ossUtil;
    @Value("${oss.cdn}")
    private String cdnUrl;

    @Override
    public UserInfoDO getUserInfoDo(Long userid) {
        return userInfoDao.getUserInfoDo(userid);
    }

    @Override
    public boolean updateNickname(String nickname, Long userid) {
        return userInfoDao.updateNickname(nickname, userid) > 0;
    }

    @Override
    public boolean replaceAvatar(MultipartFile avatar, Long userid) {
        try {
            // 尝试上传到OSS
            String filename = ossUtil.uploadFile(avatar);
            if (StrUtil.isEmpty(filename)){
                log.warn("OSS上传失败，使用默认头像");
                // 使用默认头像URL
                filename = "default-avatar.png";
            }
            // 保存头像URL到数据库
            int num = userInfoDao.updateAvatar(cdnUrl + filename, userid);
            return num > 0;
        } catch (Exception e) {
            log.error("头像上传异常，使用默认头像: {}", e.getMessage());
            // S3配置无效或其他异常时，使用默认头像
            String defaultAvatarUrl = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f464.png";
            int num = userInfoDao.updateAvatar(defaultAvatarUrl, userid);
            return num > 0;
        }
    }
}
