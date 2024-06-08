import {
    Server,
    loadPackageDefinition,
    ServerCredentials,
    status,
} from "@grpc/grpc-js";

import { loadSync } from "@grpc/proto-loader";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
async function authenticateUserById(call, callback) {
    const userId = call.request.id;
    console.log(userId);
    if (userId) {
        const user = await User.findById(userId);
        if (user) {
            const userObj = {
                id: user.id,
                isAdmin: user.isAdmin,
                email: user.email,
                mobile: user.mobile,
                firstName: user.first_name,
                lastName: user.last_name,
            };
            callback(null, userObj);
        } else {
            callback({
                message: "Invalid User Id",
                code: status.INVALID_ARGUMENT,
            });
        }
    } else {
        callback({
            message: "User Id not provided",
            code: status.INVALID_ARGUMENT,
        });
    }
}

async function authenticateUserByAccessToken(call, callback) {
    try {
        const accessToken = call.request.accessToken;
        const decodedInfo = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
        const userId = decodedInfo?.id;
        console.log(userId);
        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                const userObj = {
                    id: user.id,
                    isAdmin: user.isAdmin,
                    email: user.email,
                    mobile: user.mobile,
                    firstName: user.first_name,
                    lastName: user.last_name,
                };
                callback(null, userObj);
            } else {
                callback({
                    message: "Invalid Access Token",
                    code: status.INVALID_ARGUMENT,
                });
            }
        } else {
            callback({
                message: "Access Token not provided",
                code: status.INVALID_ARGUMENT,
            });
        }
    } catch (err) {
        callback({
            message: "Invalid Access Token",
            code: status.INVALID_ARGUMENT,
        });
    }
}

function grpcSever() {
    const definition = loadSync("../../proto/user.proto");
    const userProto = loadPackageDefinition(definition);

    const server = new Server();
    server.addService(userProto.authencationService.service, {
        authenticateUserById: authenticateUserById,
        authenticateUserByAccessToken: authenticateUserByAccessToken,
    });
    server.bindAsync(
        `0.0.0.0:${process.env.USER_GRPC_SERVER_PORT}`,
        ServerCredentials.createInsecure(),
        (error, port) => {
            if (error) {
                console.error("Server failed to bind:", error);
            } else {
                console.log(`user gRPC server running on ${port}`);
            }
        }
    );
}

export default grpcSever;
