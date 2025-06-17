package top.zway.fic.auth.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import top.zway.fic.base.entity.DO.ResourceRoleDO;
import top.zway.fic.base.entity.DTO.UserDTO;

import java.util.List;

@Mapper
public interface UserAuthDao {

    /**
     * 根据用户名导出UserDto
     * @param username
     * @return
     */
    List<UserDTO> listUserDtoByUsername(@Param("username") String username);

    /**
     * 导出所有url以及角色
     * @return
     */
    List<ResourceRoleDO> listResourceRole();
}
