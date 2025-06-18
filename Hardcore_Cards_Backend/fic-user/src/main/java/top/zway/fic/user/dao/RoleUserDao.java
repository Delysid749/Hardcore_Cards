package top.zway.fic.user.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import top.zway.fic.base.entity.DO.RoleUserDO;

import java.util.List;

/**
 * 用户角色关系数据访问对象
 * 负责用户角色关联表的数据库操作
 */
@Mapper
public interface RoleUserDao {

    /**
     * 批量插入用户角色关系记录
     * 为用户分配角色权限
     * 
     * @param roleUserDoS 用户角色关系列表
     * @return 影响的行数
     */
    int insertRoleUser(@Param("roleUserDoS") List<RoleUserDO> roleUserDoS);
}