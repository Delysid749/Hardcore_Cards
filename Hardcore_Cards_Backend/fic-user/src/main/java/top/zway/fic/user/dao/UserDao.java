package top.zway.fic.user.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import top.zway.fic.base.entity.DO.UserDO;

/**
 * 用户数据访问对象
 * 负责用户表的数据库操作
 */
@Mapper
public interface UserDao {
    
    /**
     * 插入新用户记录
     * 插入成功后，userDO对象的id字段会被自动填充为数据库生成的主键值
     * 
     * @param userDO 用户信息对象
     * @return 影响的行数，成功返回1
     */
    int insertUser(@Param("userDO") UserDO userDO);

    /**
     * 统计指定用户名的用户数量
     * 用于检查用户名是否已存在
     * 
     * @param username 用户名（邮箱地址）
     * @return 用户数量，0表示不存在，大于0表示已存在
     */
    int countUsername(@Param("username") String username);
}