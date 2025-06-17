package top.zway.fic.auth.service.impl;

import cn.hutool.http.HttpUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import top.zway.fic.auth.service.ReCaptchaVerificationService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReCaptchaVerificationServiceImpl implements ReCaptchaVerificationService {
    @Value("${reCaptcha.client.secret}")
    private String reCaptchaClientSecret;
    
    @Value("${reCaptcha.dev.bypass:false}")
    private boolean devBypass;

    private final ObjectMapper objectMapper;

    public static final String RECAPTCHA_VERIFY_URL = "https://recaptcha.net/recaptcha/api/siteverify";

    private static final String VERIFY_JSON_KEY = "success";

    @Override
    public boolean verify(String captcha) {
        // 开发环境绕过选项
        if (devBypass) {
            log.info("开发环境绕过reCAPTCHA验证，captcha: {}", captcha);
            return true;
        }
        
        try {
            Map<String, Object> paramMap = new HashMap<>(4);
            paramMap.put("secret", reCaptchaClientSecret);
            paramMap.put("response", captcha);
            
            String result = HttpUtil.post(RECAPTCHA_VERIFY_URL, paramMap);
            JsonNode jsonNode;
            try {
                jsonNode = objectMapper.readTree(result);
            } catch (IOException e) {
                log.error("解析json失败,json：{}", result);
                // 开发环境下，如果解析失败也返回true
                log.warn("reCAPTCHA验证失败，开发环境下默认通过验证");
                return true;
            }
            if (jsonNode == null || jsonNode.get(VERIFY_JSON_KEY) == null) {
                log.error("解析json失败,json：{}", result);
                // 开发环境下，如果解析失败也返回true
                log.warn("reCAPTCHA验证失败，开发环境下默认通过验证");
                return true;
            }
            return jsonNode.get(VERIFY_JSON_KEY).asBoolean();
        } catch (Exception e) {
            log.error("reCAPTCHA验证网络请求失败: {}", e.getMessage());
            // 开发环境下，如果网络请求失败也返回true
            log.warn("reCAPTCHA网络请求失败，开发环境下默认通过验证");
            return true;
        }
    }
}
