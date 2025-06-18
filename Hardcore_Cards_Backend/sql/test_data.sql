-- 测试数据插入脚本
-- 用于验证登录功能是否正常工作

USE HardcoreDashBoard;

-- 插入测试用户（密码是 123456，已用BCrypt加密）
INSERT INTO `user` (`username`, `password`, `status`) VALUES 
('test@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKXIjGrNFY9mUpWECMUQLdPX9M.u', 1);

-- 获取插入的用户ID（假设为1，实际应根据数据库情况调整）
SET @test_user_id = LAST_INSERT_ID();

-- 为测试用户分配角色
INSERT INTO `user_role` (`userid`, `role`) VALUES 
(@test_user_id, 'registered');

-- 插入用户基本信息
INSERT INTO `user_info` (`userid`, `nickname`, `avatar`) VALUES 
(@test_user_id, '测试用户', 'https://via.placeholder.com/64x64.png?text=Test');

-- 验证插入结果
SELECT u.id, u.username, u.status, ur.role, ui.nickname 
FROM `user` u 
LEFT JOIN `user_role` ur ON u.id = ur.userid 
LEFT JOIN `user_info` ui ON u.id = ui.userid 
WHERE u.username = 'test@example.com'; 