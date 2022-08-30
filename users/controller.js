import responder from '../utils/responseHandler.js';

const getToken = ({
  headers: {
    authorization
  }
}) => (authorization && authorization.split(' ')[1]) || '';


export class UsersController {
  constructor({
    usersService
  }) {
    this.users = usersService;
  }

  // Switching to an arrow function to avoid eslint class-methods-use-this
  getUserDetails = async (req, res, next) => {
    try {
      const {
        _id,
        mobile,
        email,
        dob,
        firstName,
        lastName,
        name,
        answers,
        referralCode,
        referralCodeUsed = null,
        isKycCompliant: kycStatus,
        isEmailVerified,
        personality = null,
        riskPersonality = null,
        permissions = null,
        interestedInInvest = false,
        os,
        appVersion,
        advertiserId,
        vpaDetails,
        riskProfileQuizAnswers = [],
        personalityQuizAnswers = [],
        hasPendingFundUpdates = null
      } = await this.users.getUserDetails({ userId: req.user._id });

      const { personalityColor } = personality ? this.users.constructor.addColorsToPersonality(personality) : {};

      const quizAnswers = [...riskProfileQuizAnswers, ...personalityQuizAnswers].map(({
        questionInfo: { _id: questionId, answer: answersList },
        answerDetails: { personality: answerPersonality, option, sliderNum }
      }) => {
        if (answerPersonality) {
          const { option: optionString } = answersList.find(({
            personality: optionPersonality
          }) => (optionPersonality === answerPersonality));
          return {
            questionId,
            option: optionString
          };
        }
        return {
          questionId,
          option,
          sliderNum
        };
      });
      const nextQuizQuestionOrder = (riskProfileQuizAnswers?.length || 0) + (personalityQuizAnswers?.length || 0) + 1;
      const [
        brokersList,
        hasInvested,
        cardWaitlistRegistered,
        hasCoinsHistory,
        hasClaimedInvestmentReward,
        kycDetails,
        hasEmandate,
        hasFundUpdates
      ] = await Promise.all([
        this.users.getBrokers(_id),
        this.users.getInvestmentStatus(_id),
        this.users.isRegisteredForCard({ email }),
        this.users.hasCoinsHistory({ userId: _id }),
        this.users.hasRedeemedInvestmentUnlock(_id),
        this.kycApi.getKycDetails(
          getToken(req)
        ) || Promise.resolve(null),
        this.users.hasApprovedMandate(_id),
        (hasPendingFundUpdates ?? this.users.hasPendingFundUpdates({ userRef: _id }))
      ]);

      if (!kycStatus && kycDetails) {
        const {
          isKycCompliant,
          investmentAccountId,
          gender,
          maritalStatus,
          responsePan: pan,
          fintechPrimitiveResponse = null,
          newKycStatus = null,
          nominee = null
        } = kycDetails || {};
        return responder(res)(null, {
          _id,
          mobile,
          email,
          dob,
          firstName: (name && name.split(' ')[0]) || firstName,
          lastName: (name && name.split(' ').slice(1).join(' ')) || lastName,
          fullName: name,
          answers,
          referralCode,
          referralCodeUsed,
          isKycCompliant: !!isKycCompliant,
          kycStatus: fintechPrimitiveResponse
            ? fintechPrimitiveResponse.status
            : 'Not Done',
          isEmailVerified,
          investmentAccountExists: !!investmentAccountId,
          gender,
          maritalStatus,
          pan,
          brokersList,
          hasInvestedInGoals: hasInvested,
          personality: personality && { ...personality, personalityColor },
          riskPersonality,
          cardWaitlistRegistered,
          permissions,
          isOnboardingQuizTaken: !!(riskPersonality && personality),
          nextQuizQuestionOrder,
          quizAnswers,
          interestedInInvest,
          hasCoinsHistory,
          os,
          appVersion,
          advertiserId,
          vpaDetails,
          hasEmandate,
          hasClaimedInvestmentReward,
          newKycStatus,
          nominee,
          hasPendingFundUpdates: hasFundUpdates
        });
      }
      return responder(res)(null, {
        _id,
        mobile,
        email,
        dob,
        firstName: (name && name.split(' ')[0]) || firstName,
        lastName: (name && name.split(' ').slice(1).join(' ')) || lastName,
        fullName: name,
        answers,
        referralCode,
        referralCodeUsed,
        kycStatus: null,
        isKycCompliant: !!kycStatus,
        investmentAccountExists: false,
        isEmailVerified,
        brokersList,
        hasInvestedInGoals: hasInvested,
        personality: personality && { ...personality, personalityColor },
        riskPersonality,
        cardWaitlistRegistered,
        permissions,
        isOnboardingQuizTaken: !!(riskPersonality && personality),
        nextQuizQuestionOrder,
        quizAnswers,
        interestedInInvest,
        hasCoinsHistory,
        os,
        appVersion,
        advertiserId,
        vpaDetails,
        hasEmandate,
        hasClaimedInvestmentReward,
        hasPendingFundUpdates: hasFundUpdates
      });
    } catch (err) {
      log.error(err);
      return next(err);
    }
  };
}

export default UsersController;
