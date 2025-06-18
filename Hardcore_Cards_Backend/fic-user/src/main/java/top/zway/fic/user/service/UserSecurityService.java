package top.zway.fic.user.service;

/**
 * 用户安全服务接口
 * 定义用户注册等安全相关业务操作
 */
public interface UserSecurityService {
    /**
     * 注册新用户
     * 执行完整的用户注册流程，包括：
     * 1. 检查用户名是否已存在
     * 2. 插入用户登录信息
     * 3. 分配用户默认角色
     * 4. 插入用户基本信息
     * @param username 用户名（邮箱）
     * @param password 密码
     * @return 是否注册成功
     */
    boolean registerNewUser(String username,String password);
    
    /**
     * 检查用户名是否存在
     * 用于前端实时校验用户名可用性
     * 
     * @param username 要检查的用户名（邮箱地址）
     * @return 用户名是否已存在，true-存在，false-不存在（可以使用）
     */
    boolean isUsernameExists(String username);
}
