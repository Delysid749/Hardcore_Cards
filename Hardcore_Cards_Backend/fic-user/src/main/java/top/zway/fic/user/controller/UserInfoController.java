package top.zway.fic.user.controller;

import cn.hutool.core.util.StrUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import top.zway.fic.base.constant.FileConstants;
import top.zway.fic.base.entity.DO.UserInfoDO;
import top.zway.fic.base.entity.DTO.UserDTO;
import top.zway.fic.base.result.R;
import top.zway.fic.user.service.UserInfoService;
import top.zway.fic.web.holder.LoginUserHolder;

import java.util.Locale;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserInfoController {

    private final LoginUserHolder loginUserHolder;
    private final UserInfoService userInfoService;

    @GetMapping("/currentUser")
    public R currentUser() {
        UserDTO currentUser = loginUserHolder.getCurrentUser();
        if (currentUser.getUsername() == null) {
            return R.failed();
        }
        return R.success(currentUser);
    }

    @GetMapping("/info")
    public R info() {
        Long userid = loginUserHolder.getCurrentUser().getId();
        UserInfoDO userInfoDo = userInfoService.getUserInfoDo(userid);
        return R.success(userInfoDo);
    }

    @PutMapping("/info/nickname")
    public R editNickname(String nickname) {
        if (StrUtil.isEmptyIfStr(nickname) || nickname.length() > 30) {
            return R.failed("请输入昵称：昵称长度最大为30");
        }
        Long userid = loginUserHolder.getCurrentUser().getId();
        boolean success = userInfoService.updateNickname(nickname, userid);
        return R.judge(success);
    }

    @PostMapping("/info/avatar")
    public R replaceAvatar(@RequestParam("avatar") MultipartFile avatar) {
        if (avatar == null || avatar.isEmpty()) {
            return R.failed("请上传头像");
        }
        if (avatar.getSize() > 1024 * 500) {
            return R.failed("请上传小于500KB的头像");
        }
        String[] filename = avatar.getOriginalFilename().split("\\.");
        String suffix = filename[filename.length - 1].toLowerCase(Locale.ROOT);
        if (!FileConstants.ALLOW_SUFFIX.contains(suffix)) {
            return R.failed("仅支持" + FileConstants.ALLOW_SUFFIX + "格式");
        }
        Long userid = loginUserHolder.getCurrentUser().getId();
        boolean success = userInfoService.replaceAvatar(avatar, userid);
        return R.judge(success);
    }
}
