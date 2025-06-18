package top.zway.fic.user;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

/**
 * 用户服务启动类
 * 
 * 功能说明：
 * 1. 用户信息管理服务
 * 2. 用户注册、登录相关服务
 * 3. 用户个人信息维护
 * 
 * 技术栈：
 * - Spring Boot 2.2.2
 * - Spring Cloud Alibaba
 * - MyBatis
 * - MySQL
 * - Redis
 * - Nacos（注册中心和配置中心）
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class UserMain9066 {
    public static void main(String[] args) {
        SpringApplication.run(UserMain9066.class, args);
    }
}
