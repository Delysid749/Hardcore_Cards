// 请求基础配置
export { request, tokenFail } from './request';

// RSA加密相关API - 对应原项目 rsa.js
export {
  getRsaKey,
  getCaptcha
} from './rsa';

// 认证相关API - 对应原项目 login_register.js，集成RSA加密
export {
  loginReq,
  registerReq,
  sendEmailCodeReq,
  resetPasswordReq,
  validateUsernameReq,
  validateEmailReq,
  getVerifyCode  // 统一的邮件验证码API
} from './auth';

// 看板相关API - 对应原项目 kanban.js
export {
  allKanban,
  updateKanban,
  addKanban,
  deleteKanbanReq,
  collectReq,
  kanbanContent,
  deleteShareReq
} from './kanban';

// 卡片相关API - 对应原项目 card.js
export {
  addCardReq,
  moveCardReq,
  deleteCardReq,
  deleteTagReq,
  addTagReq,
  updateCardReq,
  cardTransfer
} from './card';

// 列相关API - 对应原项目 column.js
export {
  deleteColumnReq,
  moveReq,
  updateColumn,
  addColumn
} from './column';

// 用户相关API - 对应原项目 user.js，集成RSA加密
export {
  userInfoReq,
  updateUserReq,
  updatePasswordReq,
  uploadAvatarReq,
  updateNickname,    // 原项目中的昵称更新
  updatePassword,    // RSA加密的密码更新
  updateEmail        // 邮箱更新
} from './user';

// 全局API - 对应原项目 global.js
export {
  testToken
} from './global';

// 邀请相关API - 对应原项目 invitation.js
export {
  getInvitationReq,
  handleInvitationReq,
  sendInvitationReq
} from './invitation';

// 搜索相关API - 对应原项目 search.js
export {
  searchReq
} from './search'; 