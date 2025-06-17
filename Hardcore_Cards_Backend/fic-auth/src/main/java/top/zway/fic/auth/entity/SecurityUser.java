package top.zway.fic.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import top.zway.fic.base.entity.DTO.UserDTO;

import java.util.ArrayList;
import java.util.Collection;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SecurityUser implements UserDetails {
    /**
     * ID
     */
    private Long id;
    /**
     * 用户名
     */
    private String username;
    /**
     * 用户密码
     */
    private String password;
    /**
     * 用户状态（是否启用）
     */
    private Boolean enabled;

    private Boolean accountNonExpired;  // 账户是否未过期

    private Boolean accountNonLocked;   // 账户是否未锁定

    private Boolean credentialsNonExpired;  // 凭证是否未过期

    /**
     * 权限数据
     */
    private Collection<SimpleGrantedAuthority> authorities;

    public SecurityUser(UserDTO userDTO){
//        空值检查
        if(userDTO == null){
            throw new IllegalArgumentException("UserDTO can not be null");
        }
        this.setId(userDTO.getId());
        this.setUsername(userDTO.getUsername());
        this.setPassword(userDTO.getPassword());
//        根据UserDto的实际字段设置状态
        this.setEnabled(userDTO.getStatus() == 1);
        this.setAccountNonExpired(userDTO.getAccountNonExpired() != null ? userDTO.getAccountNonExpired() : true);
        this.setAccountNonLocked(userDTO.getAccountNonLocked() != null ? userDTO.getAccountNonLocked() : true);
        this.setCredentialsNonExpired(userDTO.getCredentialsNonExpired() != null ? userDTO.getCredentialsNonExpired() : true);

        // 权限处理
        this.authorities = new ArrayList<>();
        if (userDTO.getRoles() != null) {
            userDTO.getRoles().stream()
                    .filter(role -> role != null && !role.trim().isEmpty()) // 过滤空值
                    .forEach(role -> this.authorities.add(new SimpleGrantedAuthority(role)));
        }
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities != null ? this.authorities : new ArrayList<>();
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.accountNonExpired != null ? this.accountNonExpired : true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.accountNonLocked != null ? this.accountNonLocked : true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.credentialsNonExpired != null ? this.credentialsNonExpired : true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled != null ? this.enabled : false;
    }
}
