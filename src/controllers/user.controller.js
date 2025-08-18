import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUploader } from "../utils/FileHandlingCloud.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  // here it ask for validation so we use one property
  user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  // Steps:for user creation
  // 1- get user details from frontend
  // 2- validation - not empty
  // 3- check if user is already exists: username, email
  // 4- check for images,check for avatar
  // 5- upload them cloudinary,avatar
  // 6- create user object - create entry in db
  // 7- remove password and refresh token field from response
  // 8- check user creation
  // 9- return res

  // coding session
  // 1
  // if the data is coming in form or json then you will find in req.body
  const { fullName, username, email, password } = req.body;

  // console.log("REQ.BODY", req.body);

  // 2
  // for validation we can use normal if else or this
  if (
    [fullName, username, password, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // 3
  const existedUser = await User.findOne({
    // this $or work like normal OR operator
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "Username or email is already exists");
  }

  // 4
  // multer package gives us access to file coming from frontend
  const avatarLocalPath = req.files?.avatar[0]?.path; // it is optional chaining
  // console.log(avatarLocalPath);
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage.path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(401, "Local Avatar is required");
  }
  // 5
  const avatar = await fileUploader(avatarLocalPath);
  const coverImage = await fileUploader(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(402, "Avatar is required");
  }
  // 6
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username,
  });
  // console.log(user);
  // 7
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // console.log(createdUser);

  // 8
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  // 9
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // get data from req.body
  // login with username or email
  // then find the user
  // check password
  // access and refresh token
  // send in cookie

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    // $or => it is mongodb operator
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // options is used for that any user cannot update tokens
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incommingRefreshToken) {
    throw new ApiError(401, "Unauthorize request");
  }

  try {
    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    console.log(decodedToken);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refreshToken");
    }
    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, " RefreshToken  is expired ");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("newRefreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            newRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    new ApiError(404, error.message || "In");
  }
});

export { registerUser, loginUser, logOutUser, refreshAccessToken };
