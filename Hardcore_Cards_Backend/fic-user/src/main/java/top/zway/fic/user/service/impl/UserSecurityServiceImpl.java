package top.zway.fic.user.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import top.zway.fic.base.constant.RoleConstant;
import top.zway.fic.base.entity.DO.RoleUserDO;
import top.zway.fic.base.entity.DO.UserDO;
import top.zway.fic.base.entity.DO.UserInfoDO;
import top.zway.fic.user.dao.RoleUserDao;
import top.zway.fic.user.dao.UserDao;
import top.zway.fic.user.dao.UserInfoDao;
import top.zway.fic.user.service.UserSecurityService;

import java.util.Collections;
import java.util.List;

/**
 * 用户安全服务实现类
 * 实现用户注册等安全相关业务逻辑
 */
@Service
@RequiredArgsConstructor
public class UserSecurityServiceImpl implements UserSecurityService {
    
    // 注入数据访问层依赖
    private final UserDao userDao;
    private final RoleUserDao roleUserDao;
    private final UserInfoDao userInfoDao;
    
    // 注入密码加密器
    private final PasswordEncoder passwordEncoder;

    /**
     * 用户注册业务逻辑实现
     * 使用事务保证数据一致性，任何一步失败都会回滚
     */
    @Override
    @Transactional(rollbackFor = RuntimeException.class)
    public boolean registerNewUser(String username, String password) {
        // 第一步：检查用户名是否已存在
        int countUsername = userDao.countUsername(username);
        if (countUsername > 0) {
            // 用户名已存在，注册失败
            return false;
        }
        
        // 第二步：创建用户登录信息对象
        // 使用有参构造器，参数类型：Long, String, String, Integer
        UserDO userDO = new UserDO(null, username, passwordEncoder.encode(password), Integer.valueOf(1));
        
        // 第三步：插入用户登录信息到user表
        int insertUser = userDao.insertUser(userDO);
        if (insertUser < 1) {
            // 插入失败
            return false;
        }
        
        // 第四步：为新用户分配默认角色（已注册用户角色）
        // 使用有参构造器，参数顺序：role, userid
        RoleUserDO roleUserDO = new RoleUserDO(RoleConstant.REGISTERED, userDO.getId());
        List<RoleUserDO> roleUserDoS = Collections.singletonList(roleUserDO);
        roleUserDao.insertRoleUser(roleUserDoS);
        
        // 第五步：插入用户基本信息到user_info表
        // 使用有参构造器，参数顺序：userid, nickname, avatar
        UserInfoDO userInfoDO = new UserInfoDO(userDO.getId(), username, "");
        userInfoDao.insertUserInfo(userInfoDO);
        
        // 注册流程完成，返回成功
        return true;
    }

    /**
     * 检查用户名是否存在的业务逻辑实现
     */
    @Override
    public boolean isUsernameExists(String username) {
        // 查询数据库中同名用户数量
        int count = userDao.countUsername(username);
        // 数量大于0表示用户名已存在
        return count > 0;
    }
}
