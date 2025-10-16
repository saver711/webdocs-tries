import type { ApiError, ErrorCode } from "@/app/models/api.model"

export const getErrorMessage = (error: ApiError) => {
  let errorMessage = error.message || "Something went wrong!"
  const errorCode = error.errorCode
  //   const errorCode: ErrorCode | PluralErrorCode = data.errorCode
  if (!errorCode) {
    return errorMessage
  }

  // Define a map of singular error messages.
  const singularMessages: Record<ErrorCode, string> = {
    // NOT FOUND / MISSING / REQUIRED
    REFRESH_TOKEN_NOT_FOUND: "Refresh token not found.",
    USER_NOT_FOUND: "User not found.",
    RESTAURANT_NOT_FOUND: "Restaurant not found.",
    BLOGGER_NOT_FOUND: "Blogger not found.",
    CATEGORY_NOT_FOUND: "Category not found.",
    RECOMMENDATION_NOT_FOUND: "Recommendation not found.",
    NO_MEALS_FOR_RESTAURANT: "No meals available for the restaurant.",
    AT_LEAST_ONE_LOCATION_REQUIRED: "At least one location is required.",
    NAME_IS_REQUIRED: "Name is required.",
    MISSING_GOOGLE_ID_OR_PHONE: "Google ID or phone number is required.",
    PASSWORDS_REQUIRED: "Passwords are required.",
    NO_TOKEN_PROVIDED: "No token provided",

    // EXPIRED / INCORRECT / INVALID
    REFRESH_TOKEN_EXPIRED: "Refresh token has expired.",
    INCORRECT_CURRENT_PASSWORD: "The current password is incorrect.",
    INVALID_PASSWORD: "The password is invalid.",
    INVALID_CREDENTIALS: "Credentials are invalid.",
    INVALID_OTP: "The OTP is invalid.",
    USER_NOT_VERIFIED: "User is not verified.",
    INVALID_PHONE_NUMBER: "Phone number is invalid.",
    ORIGINALLY_REGISTERED_WITH_GOOGLE:
      "This account was originally registered with Google.",
    DATA_SHOULD_BE_MULTIPLE: "You should send multiple data",

    // ALREADY EXISTS
    USER_ALREADY_EXISTS: "User already exists.",
    CATEGORY_ALREADY_EXISTS: "Category already exists.",
    BLOGGER_ALREADY_EXISTS: "Blogger already exists.",
    MEAL_ALREADY_EXISTS: "Meal already exists.",
    RESTAURANT_ALREADY_EXISTS: "Restaurant already exists.",
    RECOMMENDATION_ALREADY_EXISTS: "Recommendation already exists.",
    USER_ALREADY_VERIFIED: "User is already verified.",
    PHONE_ALREADY_REGISTERED: "Phone number is already registered.",

    // ACCESS
    ACCESS_DENIED: "Access denied.",

    // MISMATCH
    ONE_OR_MANY_MEAL_BELONG_TO_ANOTHER_RESTAURANT:
      "One or more meals belong to another restaurant.",
    EMAIL_CANNOT_BE_EDITED: "Email cannot be edited."
  }

  // Define a map of plural error messages.
  //   const pluralMessages: Record<PluralErrorCode, string> = {};

  //   if (isPlural && errorCode in pluralMessages) {
  //     errorMessage = pluralMessages[errorCode as PluralErrorCode];
  //   } else if (!isPlural && errorCode in singularMessages) {
  errorMessage = singularMessages[errorCode as ErrorCode]
  //   }

  return errorMessage || "Something went wrong!"
}
