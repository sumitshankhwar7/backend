import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "ok"
    // })

    // some steps for register user 

    // get user detailed from frontend
    // validation - not empty
    // check if user is already exists: username, email
    // check for images, check for avatar
    // upload them on cloudinary , avarar
    // create user object - create entry in batabase 
    // remove password and refresh token field from response
    // check for user creation
    // return response


    const { userName, fullName, email, password } = req.body
    console.log("email:", email)

    if ([userName, fullName, email, password].some((field) =>
        field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")

    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")

    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")

    }

    const user = await User.create({
        fullName,
        avatar: avatar?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while register the user")

    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )




    // check not empty fields this method is for beginners
    // if (fullName === "") {
    //     throw new ApiError(400, "fullName is required")
    // }

})


export { registerUser }






