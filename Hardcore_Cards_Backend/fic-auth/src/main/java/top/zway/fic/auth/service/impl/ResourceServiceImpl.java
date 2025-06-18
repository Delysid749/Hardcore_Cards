package top.zway.fic.auth.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import top.zway.fic.auth.dao.UserAuthDao;
import top.zway.fic.base.constant.RedisConstant;
import top.zway.fic.base.entity.DO.ResourceRoleDO;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl {
    private final RedisTemplate<String, Object> redisTemplate;
    private final UserAuthDao userAuthDao;

    @PostConstruct
    public void initData() {
        List<ResourceRoleDO> resourceRoleDos = userAuthDao.listResourceRole();
        Map<String, List<String>> resourceRolesMap = new HashMap<>(resourceRoleDos.size() / 2);
        for (ResourceRoleDO resourceRoleDo : resourceRoleDos) {
            // 过滤空值，确保url和role都不为空
            if (resourceRoleDo != null && 
                resourceRoleDo.getResourceUrl() != null &&
                resourceRoleDo.getRole() != null &&
                !resourceRoleDo.getResourceUrl().trim().isEmpty() &&
                !resourceRoleDo.getRole().trim().isEmpty()) {
                
                List<String> roleList = resourceRolesMap.getOrDefault(resourceRoleDo.getResourceUrl(), new ArrayList<>());
                roleList.add(resourceRoleDo.getRole());
                resourceRolesMap.put(resourceRoleDo.getResourceUrl(), roleList);
            }
        }
        // 只有在有数据时才写入Redis
        if (!resourceRolesMap.isEmpty()) {
            redisTemplate.opsForHash().putAll(RedisConstant.RESOURCE_ROLES_MAP, resourceRolesMap);
        }
    }
}