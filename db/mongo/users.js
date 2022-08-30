import mongodb from "mongodb";
import { Users as BaseUsers } from "../users.js";

const { ObjectId } = mongodb;

export class Users extends BaseUsers {
  constructor({ db }) {
    super();
    this.name = "users";
    this.db = db;
  }

  get Collection() {
    return this.db.collection(this.name);
  }

  findByMobile(mobile) {
    return this.Collection.findOne({ mobile });
  }

  findOneById(id) {
    return this.Collection.findOne({ _id: new ObjectId(id) });
  }

  register({ name, salt, password, mobile, type, secret }) {
    return this.Collection.updateOne(
      { mobile },
      {
        $set: {
          name,
          salt,
          password,
          mobile,
          type,
          secret,
        },
      },
      { upsert: true, returnNewDocument: true }
    );
  }

  async removeBroker(userId, brokerName) {
    const { brokers } = await this.Collection.findOne({
      _id: ObjectId(userId),
    });
    if (brokers && Object.keys(brokers).indexOf(brokerName) > -1) {
      delete brokers[brokerName];
    }
    return this.Collection.findOneAndUpdate(
      { _id: ObjectId(userId) },
      {
        $set: {
          brokers,
        },
      }
    );
  }

  findOne({ mobile, email }) {
    const query = JSON.parse(JSON.stringify({ mobile, email }));
    return this.Collection.findOne(query);
  }

  updateUserInfo({ userId, dob, name }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      { $set: { dob, name } }
    );
  }

  updateDob({ userId, dob }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      { $set: { dob } }
    );
  }

  update({
    firstName,
    lastName,
    name,
    salt,
    secret,
    pinSecret,
    coins = 0,
    lifetimeCoins = 0,
    perfiosRegistered = false,
    pin,
    dob,
    imageUrl,
    answers,
    mobile,
    isEmailVerified = false,
    referralCode,
    whatsAppConsent,
    appId,
  }) {
    return this.Collection.findOneAndUpdate(
      { mobile },
      {
        $currentDate: {
          createdAt: true,
        },
        $set: {
          firstName,
          lastName,
          name,
          salt,
          secret,
          pinSecret,
          coins,
          lifetimeCoins,
          perfiosRegistered,
          pin,
          dob,
          imageUrl,
          answers,
          isEmailVerified,
          isSignedUp: true,
          isV2user: true,
          referralCode,
          whatsAppConsent,
          appId,
        },
      },
      { returnNewDocument: true }
    ).then(({ value: { _id } }) => ({ id: _id }));
  }

  saveOtpData({ otp, otpSentAt, id }) {
    return this.Collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { otpData: { otp, otpSentAt } } }
    );
  }

  resetPin({ id, pin, salt }) {
    return this.Collection.updateOne(
      { _id: ObjectId(id) },
      { $set: { pin, salt } }
    );
  }

  saveLoginOtp({ otp, otpSentAt, mobile }) {
    return this.Collection.findOneAndUpdate(
      { mobile },
      {
        $set: { otpData: { otp, otpSentAt } },
      },
      { returnNewDocument: true }
    );
  }

  verifyOtp({ mobile, secret = "" }) {
    return this.Collection.findOneAndUpdate(
      { mobile },
      {
        $unset: { otp: "" },
        $set: { isMobileVerified: true, secret },
      },
      { returnNewDocument: true }
    );
  }

  verifyLoginOtp({ mobile }) {
    return this.Collection.findOneAndUpdate(
      { mobile },
      { $unset: { otpData: "" } }
    );
  }

  updateOtp({ mobile, otp }) {
    return this.Collection.updateOne(
      { mobile },
      { $set: { otp, otpSentAt: new Date() } },
      { upsert: true }
    );
  }

  updatePin({ mobile, pin }) {
    return this.Collection.updateOne(
      { mobile },
      { $set: { pin } },
      { upsert: false }
    );
  }

  insertOtp({ mobile, otp }) {
    return this.Collection.insertOne({
      mobile,
      otp,
      otpSentAt: new Date(),
      isSignedUp: false,
      isV2user: true,
    });
  }

  saveVerifyMail({ email, mobile, salt }) {
    return this.Collection.updateOne(
      {
        mobile,
      },
      {
        $set: { email, emailSalt: salt, isEmailVerified: false },
      }
    );
  }

  verifyMail({ email, mobile }) {
    const query = JSON.parse(JSON.stringify({ email, mobile }));
    return this.Collection.updateOne(query, {
      $set: { email, isEmailVerified: true },
    });
  }

  verifyMailViaOauth({ email, mobile }) {
    const query = JSON.parse(JSON.stringify({ mobile }));
    return this.Collection.findOneAndUpdate(query, {
      $set: { email, isEmailVerified: true },
    }).then(({ value }) => value);
  }

  updateAnswers({ userId, answers }) {
    return this.Collection.findOneAndUpdate(
      { _id: ObjectId(userId) },
      { $push: { answers } },
      { projection: { answers: 1 } }
    );
  }

  updateWhatsAppConsent({ userId, whatsAppConsent }) {
    return this.Collection.findOneAndUpdate(
      { _id: ObjectId(userId) },
      { $set: { whatsAppConsent } },
      { projection: { whatsAppConsent: 1 } }
    );
  }

  updateKycStatus({ userId, isKycCompliant }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      { $set: { isKycCompliant } }
    );
  }

  checkEmailVerification({ email, isEmailVerified }) {
    return this.Collection.findOne({ email, isEmailVerified });
  }

  updateFcmToken({ userId, fcm }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      { $set: { fcm } }
    );
  }

  updatePersonalityQuizAnswers({
    userId,
    questionInfo,
    personalityInfo,
    answerDetails,
  }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          personalityQuizAnswers: {
            questionInfo,
            personalityInfo,
            answerDetails,
          },
        },
      }
    );
  }

  addAddress({ userId, address }) {
    return this.Collection.findOneAndUpdate(
      { _id: ObjectId(userId) },
      {
        $addToSet: {
          address: {
            address,
            addressId: ObjectId(),
            editable: true,
            isPrimary: false,
            isActive: true,
          },
        },
      },
      { returnOriginal: false }
    );
  }

  updateAddress({
    userId,
    address: {
      addressId,
      houseAndStreet,
      city,
      state,
      country,
      pincode,
      geolocation,
    },
  }) {
    const updateAddress = {
      houseAndStreet,
      city,
      state,
      country,
      pincode,
      geolocation,
    };
    return this.Collection.updateOne(
      {
        _id: ObjectId(userId),
        "address.addressId": ObjectId(addressId),
      },
      {
        $set: {
          "address.$.address": updateAddress,
        },
      }
    );
  }

  deleteAddress({ userId, addressId }) {
    return this.Collection.updateOne(
      {
        _id: ObjectId(userId),
        "address.addressId": ObjectId(addressId),
      },
      {
        $set: {
          "address.$.isActive": false,
        },
      }
    );
  }

  setAllAddressNonPrimary(userId) {
    return this.Collection.updateOne(
      {
        _id: ObjectId(userId),
        "address.isPrimary": true,
      },
      {
        $set: {
          "address.$.isPrimary": false,
        },
      }
    );
  }

  setKycAddressPrimary({ userId }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      { $set: { isKycAddressPrimary: true } }
    );
  }

  setAddressPrimary({ userId, addressKey }) {
    return this.Collection.updateOne(
      {
        _id: ObjectId(userId),
        "address.addressId": ObjectId(addressKey),
      },
      {
        $set: {
          "address.$.isPrimary": true,
          isKycAddressPrimary: false,
        },
      }
    );
  }

  logout(userId) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          secret: "",
          pinSecret: "",
        },
      }
    );
  }

  updateBrokerDetails({
    userRef,
    brokerUserName,
    brokerUserId,
    broker,
    dematConsent,
  }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userRef) },
      {
        ...(broker === "fivePaisa" && {
          $rename: {
            [`temp${broker}Data.email`]: `brokers.${broker}.email`,
            [`temp${broker}Data.mobile`]: `brokers.${broker}.mobile`,
            [`temp${broker}Data.source`]: `brokers.${broker}.source`,
          },
        }),
        $set: {
          [`brokers.${broker}.username`]: brokerUserName,
          [`brokers.${broker}.uniqueClientCode`]: brokerUserId,
          [`brokers.${broker}.dematConsent`]: dematConsent,
        },
      }
    );
  }

  updateBrokerLoginDetails({ userRef, broker, email, mobile, source }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userRef) },
      {
        $set: {
          [`temp${broker}Data.email`]: email,
          [`temp${broker}Data.mobile`]: mobile,
          [`temp${broker}Data.source`]: source, // This is not to be used as it will be filled out from FE always.
        },
      }
    );
  }

  async getBrokerInfo({ userRef, broker }) {
    // @see https://docs.mongodb.com/manual/release-notes/4.4/#projection
    // Once we update our prod mongo server to 4.4, we can use nested fields and vars in projection!
    const response = await this.Collection.findOne(
      {
        _id: ObjectId(userRef),
        [`brokers.${broker}`]: { $exists: true },
      },
      {
        projection: {
          _id: 0,
          brokers: 1,
        },
      }
    );
    const brokerInfo = response.brokers?.[broker];
    return {
      mobile: brokerInfo?.mobile || null,
      email: brokerInfo?.email || "",
      clientCode: brokerInfo.uniqueClientCode || "",
    };
  }

  updateBeneficiary({ userId, vpa, name, beneId }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          cashfreeBeneficiaryAdded: true,
        },
        $push: {
          vpaDetails: {
            beneId,
            beneficiaryName: name,
            vpa,
          },
        },
      }
    );
  }

  updateVpaDetails({ userId, vpaDetails, cashfreeBeneficiaryAdded }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          cashfreeBeneficiaryAdded,
          vpaDetails,
        },
      }
    );
  }

  updatePreference({ preference, userId }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          preference: {
            whatsapp: preference.whatsapp,
            stackapp: preference.stackapp,
          },
        },
      },
      { upsert: true }
    );
  }

  findByReferral(referralcode) {
    return this.Collection.findOne({ referralcode });
  }

  findReferralOwner({ referralCode, userId }) {
    return this.Collection.findOne({
      _id: { $ne: ObjectId(userId) },
      referralCode,
    });
  }

  addOwnerReferralBonus({ userId, totalOwnerCoins, currentOwnerCoins }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          "coins.totalCoins": totalOwnerCoins,
          "coins.currentCoins": currentOwnerCoins,
        },
      }
    );
  }

  setReferralCode({ userId, referralCodeUsed }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          referralCodeUsed,
        },
      }
    );
  }

  updateCoins({
    totalCoins,
    totalRedemption,
    updatedCoins,
    blockedCoins,
    userId,
  }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $inc: {
          "coins.totalRedemption": totalRedemption,
          "coins.currentCoins": updatedCoins,
          "coins.totalCoins": totalCoins,
          "coins.blockedCoins": blockedCoins,
        },
      }
    );
  }

  updatePersonality({ userId, personality }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      { $set: { personality } }
    );
  }

  async getExistingUsers(contactNumbers) {
    const existingUsers = await this.Collection.find(
      {
        mobile: {
          $in: contactNumbers,
        },
      },
      {
        projection: {
          mobile: 1,
          name: 1,
        },
      }
    ).toArray();
    if (existingUsers?.length) {
      return existingUsers.reduce(
        (contacts, { mobile, _id: userId, name }) => ({
          ...contacts,
          [mobile]: { userId, name },
        }),
        {}
      );
    }
    return {};
  }

  async getParticipantDetails(participantIds) {
    const userIds = participantIds.map((userId) => ObjectId(userId));
    const participantDetails = await this.Collection.find(
      {
        _id: {
          $in: userIds,
        },
      },
      {
        projection: {
          name: 1,
        },
      }
    ).toArray();
    if (participantDetails?.length) {
      return participantDetails.reduce(
        (participants, { _id, name }) => ({ ...participants, [_id]: { name } }),
        {}
      );
    }
    return {};
  }

  async getParticipantsData(participantIds) {
    return this.Collection.find(
      { _id: { $in: participantIds.map((id) => ObjectId(id)) } },
      {
        projection: {
          profilePicture: 1,
          userId: "$_id",
          name: 1,
          email: 1,
          mobile: 1,
          fcm: 1,
        },
      }
    ).toArray();
  }

  updateRiskProfileAnswer({
    userId,
    questionInfo,
    answerDetails,
    fieldName,
    fieldValue,
  }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          ...(fieldName &&
            (fieldValue || fieldValue === 0) && { [fieldName]: +fieldValue }),
        },
        $addToSet: {
          riskProfileQuizAnswers: {
            questionInfo,
            answerDetails,
          },
        },
      }
    );
  }

  updateAnswerData({
    weightedScore,
    option,
    personality,
    weightage,
    score,
    questionId,
    userId,
    sliderNum,
  }) {
    return this.Collection.updateOne(
      {
        _id: ObjectId(userId),
        ...(personality && {
          "personalityQuizAnswers.questionInfo._id": ObjectId(questionId),
        }),
        ...(!personality && {
          "riskProfileQuizAnswers.questionInfo._id": ObjectId(questionId),
        }),
      },
      {
        $set: {
          ...(personality && {
            "personalityQuizAnswers.$.answerDetails": {
              personality,
              weightage,
            },
          }),
          ...(!personality && {
            "riskProfileQuizAnswers.$.answerDetails": {
              weightedScore,
              option,
              score,
              ...(sliderNum && { sliderNum: +sliderNum }),
            },
          }),
        },
      }
    );
  }

  updateRiskPersonality({ userId, riskPersonality }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      { $set: { riskPersonality } }
    );
  }

  updateMetaData({ userId, os, appVersion, advertiserId, updatedAt, appId }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          os,
          appVersion,
          advertiserId,
          updatedAt,
          appId,
        },
      }
    );
  }

  getUsers({
    skipStage,
    limitStage,
    userRefs,
    mobileNums,
    isDownloadReq,
    startDate,
    endDate,
  }) {
    const query = {};
    if (mobileNums?.length) {
      query.mobile = { $in: mobileNums.map((num) => num) };
    }
    if (userRefs?.length) {
      query._id = { $in: userRefs.map((ref) => ObjectId(ref)) };
    }

    query.createdAt = {
      $exists: true,
    };

    if (startDate && endDate) {
      query.createdAt = {
        $exists: true,
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.createdAt = {
        $exists: true,
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      query.createdAt = {
        $exists: true,
        $lte: new Date(endDate),
      };
    }

    const data = [
      {
        $match: query,
      },
    ];
    if (!isDownloadReq) {
      data.push(
        ...[
          {
            $skip: skipStage,
          },
          {
            $limit: limitStage,
          },
        ]
      );
    }
    data.push(
      ...[
        {
          $group: {
            _id: null,
            users: {
              $push: {
                _id: "$_id",
                firstName: "$firstName",
                lastName: "$lastName",
                name: "$name",
                mobile: "$mobile",
                email: "$email",
                rewards: "$coins",
                createdAt: "$createdAt",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            users: 1,
          },
        },
      ]
    );
    return this.Collection.aggregate([
      {
        $facet: {
          data,
          count: [
            {
              $match: query,
            },
            {
              $group: {
                _id: 0,
                total: {
                  $sum: 1,
                },
              },
            },
            {
              $project: {
                _id: 0,
                total: 1,
              },
            },
          ],
        },
      },
    ])
      .toArray()
      .then((val) => val[0] || {});
  }

  getPersonalities({
    skipStage,
    limitStage,
    userRefs,
    mobileNums,
    isDownloadReq,
    startDate,
    endDate,
  }) {
    const query = {};
    if (mobileNums?.length) {
      query.mobile = { $in: mobileNums.map((num) => num) };
    }
    if (userRefs?.length) {
      query._id = { $in: userRefs.map((ref) => ObjectId(ref)) };
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      query.createdAt = {
        $lte: new Date(endDate),
      };
    }

    const data = [
      {
        $match: query,
      },
    ];
    if (!isDownloadReq) {
      data.push(
        ...[
          {
            $skip: skipStage,
          },
          {
            $limit: limitStage,
          },
        ]
      );
    }
    data.push(
      ...[
        {
          $group: {
            _id: null,
            personalities: {
              $push: {
                _id: "$_id",
                name: "$name",
                mobile: "$mobile",
                email: "$email",
                riskPersonalityType: "$riskPersonality.personalityType",
                riskPersonalityScore: "$riskPersonality.totalScore",
                personalityType: "$personality.personalityType",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            personalities: 1,
          },
        },
      ]
    );
    return this.Collection.aggregate([
      {
        $facet: {
          data,
          count: [
            {
              $match: query,
            },
            {
              $group: {
                _id: 0,
                total: {
                  $sum: 1,
                },
              },
            },
            {
              $project: {
                _id: 0,
                total: 1,
              },
            },
          ],
        },
      },
    ])
      .toArray()
      .then((val) => val[0] || {});
  }

  updatePermissions({ userId, permissions }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      { $set: permissions }
    );
  }

  resetRiskProfile({ userId }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $unset: {
          riskProfileQuizAnswers: "",
          riskPersonality: "",
        },
      }
    );
  }

  interestedInvest({ userId, interestedInInvest }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          interestedInInvest,
        },
      }
    );
  }

  appRating({ userId, appRating }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          appRating,
        },
      }
    );
  }

  deleteOne(id) {
    return this.Collection.deleteOne({
      _id: ObjectId(id),
    });
  }

  setAccountDeletionOTP({ userRef, otp }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userRef) },
      {
        $set: {
          deletionOTP: {
            sentAt: new Date(),
            otp,
          },
        },
      }
    );
  }

  insertDeletionReason({ userRef, reason, description }) {
    return this.Collection.updateOne(
      { _id: ObjectId(userRef) },
      {
        $set: {
          deletionReason: {
            reason,
            description,
            reasonSetAt: new Date(),
          },
        },
      }
    );
  }
}
export default Users;
