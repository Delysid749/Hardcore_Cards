package top.zway.fic.base.constant;

/**
 * RabbitMQ消息队列常量类
 * 
 * 作用说明：
 * 1. 定义消息队列的交换机、队列、路由等命名规范
 * 2. 统一管理消息队列的配置参数
 * 3. 支持异步数据处理和系统解耦
 * 
 * 架构设计：
 * - 数据更新：支持实时更新和延迟批量更新两种模式
 * - 死信队列：处理失败消息的重试和兜底机制
 * - 邮件发送：异步发送通知邮件，提升用户体验
 * - 邀请提醒：定时提醒用户处理未读邀请
 * 
 * 消息模式：
 * - Fanout：广播模式，一条消息发送给所有绑定的队列
 * - TTL：消息存活时间，用于延迟处理
 * - Dead Letter：死信处理，保证消息不丢失
 * 
 * @author hardcore-cards
 * @since 1.0
 */
public class RabbitMqConstants {
    
    // ==================== 数据更新相关队列 ====================
    
    /**
     * 部分数据更新交换机名称
     * 
     * 类型：Fanout Exchange（扇出交换机）
     * 作用：当看板数据发生变化时，立即广播更新消息
     * 触发场景：
     * - 卡片新增、修改、删除
     * - 列的调整、重命名
     * - 标签的增删改
     * 
     * 工作原理：
     * 1. 业务操作完成后发送消息到此交换机
     * 2. 交换机将消息广播到所有绑定的队列
     * 3. 消费者处理数据更新（如：搜索索引更新）
     */
    public static final String DATA_UPDATE_EXCHANGE_NAME = "data_update_fanout_exchange";
    
    /**
     * 部分数据更新队列名称
     * 
     * 处理内容：接收实时数据变更消息
     * 消费逻辑：
     * - 立即更新Elasticsearch搜索索引
     * - 清理相关的Redis缓存
     * - 通知其他相关服务数据变更
     * 
     * 优先级：高（实时处理）
     */
    public static final String DATA_UPDATE_QUEUE_NAME = "data.update.queue";
    
    /**
     * 部分更新队列最大长度
     * 
     * 限制：10000条消息
     * 设计原理：
     * - 防止消息堆积导致内存溢出
     * - 保证实时性，避免消息积压过多
     * - 超出限制时触发队列保护机制
     */
    public static final int DATA_UPDATE_WAITING_MAX_LENGTH = 10000;

    // ==================== 全量更新延迟队列 ====================
    
    /**
     * 全量数据更新延迟队列交换机名称
     * 
     * 类型：Fanout Exchange + TTL
     * 作用：延迟触发全量数据更新，避免频繁的全量操作
     * 
     * 设计思路：
     * 当有大量数据变更时，不立即执行全量更新，而是等待一段时间
     * 让多个变更合并为一次全量更新，提升系统性能
     */
    public static final String FULL_UPDATE_TTL_EXCHANGE_NAME = "full_update_ttl_fanout_exchange";
    
    /**
     * 全量数据更新延迟队列名称
     * 
     * 特点：带有TTL（存活时间）的队列
     * 消息生命周期：
     * 1. 消息发送到此队列
     * 2. 等待TTL时间（30分钟）
     * 3. TTL过期后消息转发到死信队列
     * 4. 死信队列的消费者执行全量更新
     */
    public static final String FULL_UPDATE_TTL_QUEUE_NAME = "full.update.ttl.queue";
    
    /**
     * 全量数据更新TTL时间（毫秒）
     * 
     * 时间：30分钟
     * 设计原理：
     * - 给系统足够时间收集批量变更
     * - 避免过于频繁的全量更新操作
     * - 平衡数据一致性和系统性能
     */
    public static final int FULL_UPDATE_TTL_MILLISECOND = 1000 * 60 * 30;
    
    /**
     * 全量数据更新延迟队列最大长度
     * 
     * 限制：1000条消息
     * 作用：
     * - 控制延迟队列的大小
     * - 防止内存过度占用
     * - 全量更新频率相对较低，1000条足够使用
     */
    public static final int FULL_UPDATE_WAITING_MAX_LENGTH = 1000;

    // ==================== 死信队列（实际执行全量更新）====================
    
    /**
     * 全量数据更新死信交换机名称
     * 
     * 类型：Dead Letter Exchange（死信交换机）
     * 作用：接收从TTL队列过期的消息，触发实际的全量更新
     * 
     * 工作流程：
     * 1. TTL队列中的消息过期
     * 2. 过期消息自动转发到此死信交换机
     * 3. 死信交换机将消息路由到死信队列
     * 4. 消费者从死信队列获取消息并执行全量更新
     */
    public static final String FULL_UPDATE_DEAD_EXCHANGE_NAME = "full_update_dead_fanout_exchange";
    
    /**
     * 全量数据更新死信队列名称
     * 
     * 处理内容：执行全量数据更新操作
     * 消费逻辑：
     * - 重新构建Elasticsearch的完整索引
     * - 刷新所有相关的Redis缓存
     * - 确保数据的最终一致性
     * 
     * 优先级：低（延迟处理，但很重要）
     */
    public static final String FULL_UPDATE_DEAD_QUEUE_NAME = "full.update.dead.queue";

    // ==================== 邮件发送队列 ====================
    
    /**
     * 邮件发送交换机名称
     * 
     * 类型：Fanout Exchange
     * 作用：异步发送各类邮件通知
     * 触发场景：
     * - 用户注册欢迎邮件
     * - 邀请协作邮件
     * - 密码重置邮件
     * - 系统通知邮件
     */
    public static final String MAIL_SEND_EXCHANGE_NAME = "mail_send_fanout_exchange";
    
    /**
     * 邮件发送队列名称
     * 
     * 处理内容：异步发送邮件
     * 消费逻辑：
     * - 根据邮件模板生成邮件内容
     * - 调用邮件服务API发送邮件
     * - 记录发送结果和失败重试
     * 
     * 优势：
     * - 不阻塞主业务流程
     * - 提升用户操作响应速度
     * - 支持邮件发送失败重试
     */
    public static final String MAIL_SEND_QUEUE_NAME = "mail.send.queue";

    // ==================== 邀请提醒队列 ====================
    
    /**
     * 邀请提醒交换机名称
     * 
     * 类型：Fanout Exchange
     * 作用：定时提醒用户处理未读的协作邀请
     * 触发场景：
     * - 邀请发出后24小时未处理
     * - 定期扫描未处理邀请
     */
    public static final String INVITATION_REMINDER_EXCHANGE_NAME = "invitation_reminder_fanout_exchange";
    
    /**
     * 邀请提醒队列名称
     * 
     * 处理内容：发送邀请提醒
     * 消费逻辑：
     * - 查询长时间未处理的邀请
     * - 生成提醒邮件或站内消息
     * - 避免重复提醒同一个邀请
     * 
     * 业务价值：
     * - 提高邀请的处理率
     * - 改善团队协作体验
     * - 减少邀请遗漏的情况
     */
    public static final String INVITATION_REMINDER_QUEUE_NAME = "invitation.reminder.queue";
}
