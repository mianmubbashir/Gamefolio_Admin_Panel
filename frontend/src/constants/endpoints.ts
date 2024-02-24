export const PATH = {
  auth: {
    register: "admin/signup",
    login: "admin/signin",
    loginTwitter: "success",
    sendForgotPasswordOTP: "admin/forgot-password/otp",
    verifyForgotPasswordOTP: "admin/forgot-password/otp/verify",
    resetPassword: "admin/reset-password",
    verifyEmail: "auth/verify-email",
    resetPasswordByVerfToken: "auth/reset-password/",
    logout: "auth/logout",
  },

  user: {
    preferences: "admin/preferences/create",
    favoritegame: "admin/favorite-games/create",
    getUser: "admin/getUser",
    getProfileInfo: "admin/profile/get",
    getAllUsers: "admin/getAllUsers",
    updateProfile: "admin/profile/update",
    updatePassword: "admin/password/update",
    followUser: "admin/follower/create",
    removeFollow: "admin/follower/delete",
    removeFollowing: "admin/following/delete",
    blockUser: "admin/block/create",
    unBlockUser: "admin/block/delete",
    deactiveAccount: "admin/deactivate",
    reportUser: "admin/report/create",
  },

  theNextLeg: {
    root: "the-next-leg",
    imagine: "the-next-leg/imagine",
    webhook: "the-next-leg/webhook",
  },

  design: {
    root: "design",
  },

  post: {
    create: "post/video/create",
    get: "post/video/get",
    getTrendingPosts: "post/video/trending/get",
    getFollowingPosts: "post/video/following/get",
    delete: "post/video/delete",
  },

  clip: {
    create: "clip/video/create",
    get: "clip/video/get",
    delete: "clip/video/delete",
  },

  story: {
    create: "stories/story/create",
    get: "stories/story/get",
    getFollowingStories: "stories/story/following/get",
    getCurrentUserStories: "stories/story/user/get",
    getUser: "stories/story/get-user",
    delete: "stories/story/delete",
  },
  reaction: {
    create: "post/video/reaction/create",
    delete: "post/video/reaction/delete",
  },

  clipReaction: {
    create: "clip/video/reaction/create",
    delete: "clip/video/reaction/delete",
  },

  comment: {
    create: "post/comment/create",
  },

  music: {
    getAllMusic: "music/get/all",
  },
  chat: {
    init: "v1/chat/init",
    getUserMessages: "v1/chat/messages/get",
  },

  bookmark: {
    create: "post/bookmark/create",
    get: "post/bookmark/get",
    remove: "post/bookmark/remove",
  },
};
