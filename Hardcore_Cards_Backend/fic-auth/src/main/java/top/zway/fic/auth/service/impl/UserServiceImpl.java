package top.zway.fic.auth.service.impl;

import cn.hutool.core.collection.CollUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import top.zway.fic.auth.dao.UserAuthDao;
import top.zway.fic.auth.entity.SecurityUser;
import top.zway.fic.base.constant.UserLoginStateConstants;
import top.zway.fic.base.entity.DTO.UserDTO;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户认证服务实现类
 *
 * 核心作用：
 * 1. 实现Spring Security的UserDetailsService接口，为OAuth2认证框架提供用户信息
 * 2. 在OAuth2认证流程中，当用户尝试登录时，框架会自动调用loadUserByUsername方法
 * 3. 负责从数据库加载用户信息，并转换为Spring Security能够理解的UserDetails对象
 * 4. 执行用户状态检查（启用/禁用、锁定、过期等），确保只有合法用户能够登录
 *
 * 认证流程中的位置：
 * 前端登录请求 → OAuth2框架接收 → 调用此类的loadUserByUsername → 查询数据库 → 状态检查 → 返回用户信息 → 生成JWT Token
 *
 * 设计原理：
 * - 遵循Spring Security的标准接口规范，确保与OAuth2框架的无缝集成
 * - 采用依赖注入模式，通过UserAuthDao访问数据库，实现了数据访问层的解耦
 * - 实现了完整的用户状态检查机制，提供了多层次的安全保护
 *
 * @author Ethan Yao
 * @since 1.0.0
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserDetailsService {

    /**
     * 用户认证数据访问对象
     * 负责从数据库中查询用户相关信息
     */
    private final UserAuthDao userAuthDao;

    /**
     * 根据用户名加载用户详细信息
     *
     * 此方法是Spring Security OAuth2认证体系的核心入口点：
     * 1. 当用户在前端提交用户名密码时，OAuth2框架会自动调用此方法
     * 2. 框架传入用户名，期望获得包含用户信息和权限的UserDetails对象
     * 3. 该方法负责数据库查询、用户状态验证、权限加载等核心认证逻辑
     *
     * 执行流程：
     * Step 1: 数据库查询 - 根据用户名从数据库中查找用户记录
     * Step 2: 用户存在性检查 - 验证用户是否存在，不存在则抛出异常
     * Step 3: 用户状态检查 - 检查用户是否被禁用、锁定、过期等
     * Step 4: 返回用户详情 - 将用户信息封装为SecurityUser对象返回
     *
     * 安全机制：
     * - 精确匹配用户名，防止SQL注入和模糊查询安全风险
     * - 多重状态检查，确保只有状态正常的用户能够通过认证
     * - 详细的异常信息，便于前端展示对应的错误提示
     *
     * @param username 用户名（前端登录时提交的用户名）
     * @return UserDetails 包含用户信息、权限和状态的对象，供OAuth2框架使用
     * @throws UsernameNotFoundException 用户不存在时抛出
     * @throws DisabledException 用户被禁用时抛出
     * @throws LockedException 用户被锁定时抛出
     * @throws AccountExpiredException 用户账户过期时抛出
     * @throws CredentialsExpiredException 用户凭证过期时抛出
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Step 1: 数据库查询
        // 原理：通过DAO层查询数据库，获取所有匹配的用户记录
        // 注意：这里使用List是因为可能存在模糊查询的情况，需要进一步筛选
        List<UserDTO> userDTOList = userAuthDao.listUserDtoByUsername(username);

        // Step 2: 精确匹配用户名
        // 原理：从查询结果中筛选出用户名完全匹配的记录
        // 安全考虑：防止模糊查询导致的用户身份混淆，确保用户名的唯一性和准确性
        List<UserDTO> findUserDtoList = userDTOList.stream()
                .filter(item -> item.getUsername().equals(username))
                .collect(Collectors.toList());

        // Step 3: 用户存在性检查
        // 原理：如果没有找到匹配的用户，说明用户名不存在，抛出标准的Spring Security异常
        // 注意：这里抛出的异常信息应该是ACCOUNT_DISABLED，可能是常量命名不当，建议改为USERNAME_NOT_FOUND
        if(CollUtil.isEmpty(findUserDtoList)){
            throw new UsernameNotFoundException(UserLoginStateConstants.ACCOUNT_DISABLED);
        }

        // Step 4: 创建Spring Security用户对象
        // 原理：将业务层的UserDTO对象转换为Spring Security标准的UserDetails对象
        // 转换过程：UserDTO → SecurityUser → UserDetails（多态）
        SecurityUser securityUser = new SecurityUser(findUserDtoList.get(0));

        // Step 5: 用户状态安全检查
        // 原理：Spring Security提供了多重用户状态检查机制，确保系统安全

        // 5.1 检查用户是否被禁用
        // 应用场景：管理员手动禁用用户账户，或系统自动禁用异常账户
        if (!securityUser.isEnabled()) {
            throw new DisabledException(UserLoginStateConstants.ACCOUNT_DISABLED);
        }
        // 5.2 检查用户账户是否被锁定
        // 应用场景：多次登录失败后自动锁定，或管理员手动锁定
        else if (!securityUser.isAccountNonLocked()) {
            throw new LockedException(UserLoginStateConstants.ACCOUNT_LOCKED);
        }
        // 5.3 检查用户账户是否过期
        // 应用场景：临时账户到期，或长期未使用的账户自动过期
        else if (!securityUser.isAccountNonExpired()) {
            throw new AccountExpiredException(UserLoginStateConstants.ACCOUNT_EXPIRED);
        }
        // 5.4 检查用户凭证（密码）是否过期
        // 应用场景：强制用户定期更换密码，或密码长期未更新
        else if (!securityUser.isCredentialsNonExpired()) {
            throw new CredentialsExpiredException(UserLoginStateConstants.CREDENTIALS_EXPIRED);
        }

        // Step 6: 返回用户详情
        // 原理：返回包含用户信息、权限和状态的SecurityUser对象
        // 后续流程：OAuth2框架接收到此对象后，会进行密码验证，然后生成JWT Token
        return securityUser;
    }
}