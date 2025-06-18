package top.zway.fic.user.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import top.zway.fic.base.entity.DO.UserInfoDO;

/**
 * 用户信息数据访问对象
 * 负责用户信息表的数据库操作
 */
@Mapper
public interface UserInfoDao {
    
    /**
     * 插入用户信息记录
     * 保存用户的昵称、头像等扩展信息
     * 
     * @param userInfoDo 用户信息对象
     * @return 影响的行数，成功返回1
     */
    int insertUserInfo(@Param("userInfoDo") UserInfoDO userInfoDo);
}