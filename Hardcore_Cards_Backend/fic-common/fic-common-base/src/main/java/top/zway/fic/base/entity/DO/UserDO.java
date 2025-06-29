package top.zway.fic.base.entity.DO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDO implements Serializable {
    private Long id;
    private String username;
    private String password;
    private Integer status;
}
