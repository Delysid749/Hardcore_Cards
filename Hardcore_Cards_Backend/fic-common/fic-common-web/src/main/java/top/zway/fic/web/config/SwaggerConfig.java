package top.zway.fic.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2; // ✅ 修改导入

/**
 * Swagger API文档配置类
 * 兼容Spring Boot 2.2.2版本
 */
@Configuration
@EnableSwagger2 // ✅ 使用Swagger2替代OpenApi
public class SwaggerConfig {

    @Bean
    public Docket docket(){
        return new Docket(DocumentationType.SWAGGER_2) // ✅ 使用SWAGGER_2
                .apiInfo(apiInfo())
                .enable(true)
                .groupName("fic-api")
                .select()
                .apis(RequestHandlerSelectors.basePackage("top.zway.fic"))
                .paths(PathSelectors.any())
                .build();
    }

    @SuppressWarnings("all")
    public ApiInfo apiInfo(){
        return new ApiInfo(
                "Flash Idea Card API",
                "微服务看板管理系统API文档",
                "v1.0",
                "http://localhost",
                "开发团队",
                "Apache 2.0",
                "http://www.apache.org/licenses/LICENSE-2.0"
        );
    }
}