package top.zway.fic.web.holder;

import cn.hutool.core.convert.Convert;
import cn.hutool.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import top.zway.fic.base.entity.DTO.UserDTO;
import top.zway.fic.web.exception.BizException;

import javax.servlet.http.HttpServletRequest;

@Component
public class LoginUserHolder {

    public UserDTO getCurrentUser(){
        //从Header中获取用户信息
        ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = servletRequestAttributes.getRequest();
        String userStr = request.getHeader("user");
        JSONObject userJsonObject = new JSONObject(userStr);
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(userJsonObject.getStr("user_name"));
        userDTO.setId(Convert.toLong(userJsonObject.get("id")));
        userDTO.setRoles(Convert.toList(String.class,userJsonObject.get("authorities")));
        if (userDTO.getId() == null){
            throw new BizException("未能获取当前用户");
        }
        return userDTO;
    }

    /**
     * 获取当前登录用户的ID
     * 
     * @return 用户ID，如果未登录则返回null
     */
    public Integer getCurrentUserId() {
        try {
            UserDTO currentUser = getCurrentUser();
            return currentUser != null && currentUser.getId() != null ? 
                   Convert.toInt(currentUser.getId()) : null;
        } catch (Exception e) {
            // 如果获取用户信息失败，返回null而不是抛出异常
            return null;
        }
    }
}
