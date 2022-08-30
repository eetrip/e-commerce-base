import { DB } from '../db/db.js';

export class UsersService {
  constructor({
    db = new DB()
  }) {
    this.db = db;
  }

  async getUserDetails({ userId }) {
    return this.db.Users.findOneById(userId).then(({
      _id,
      mobile,
      email,
      dob,
      firstName,
      lastName,
      name,
      answers,
      appId,
      referralCode,
      referralCodeUsed = null,
      isKycCompliant,
      isEmailVerified,
      personality = null,
      riskPersonality = null,
      permissions = null,
      interestedInInvest = false,
      profilePicture,
      isSignedUp,
      isV2user,
      os,
      appVersion,
      advertiserId,
      vpaDetails,
      riskProfileQuizAnswers,
      personalityQuizAnswers,
      hasPendingFundUpdates = null
    }) => ({
      firstName,
      lastName,
      email,
      profilePicture,
      isSignedUp,
      isV2user,
      _id,
      mobile,
      dob,
      name,
      answers,
      appId,
      referralCode,
      referralCodeUsed,
      isKycCompliant,
      isEmailVerified,
      personality,
      riskPersonality,
      permissions,
      interestedInInvest,
      os,
      appVersion,
      advertiserId,
      vpaDetails,
      riskProfileQuizAnswers,
      personalityQuizAnswers,
      hasPendingFundUpdates
    }));
  }
}

export default UsersService;
