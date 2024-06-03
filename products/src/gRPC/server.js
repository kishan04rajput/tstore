import {
    Server,
    loadPackageDefinition,
    ServerCredentials,
    status,
} from "@grpc/grpc-js";

import { loadSync } from "@grpc/proto-loader";
import { Product } from "../models/product.models.js";

async function getProductById(call, callback) {
    const productId = call.request.id;
    console.log('product_id', productId);
    if(!productId) {
        callback({
            message: "Product Id not provided",
            code: status.INVALID_ARGUMENT,
        });
    }
    const product = await Product.findById(productId);
    if(!product) {
        callback({
            message: "Invalid Product Id",
            code: status.INVALID_ARGUMENT,
        });
    }
    callback(null, product);
}


function grpcSever() {
    const definition = loadSync("../proto/product.proto");
    const productProto = loadPackageDefinition(definition);

    const server = new Server();
    server.addService(productProto.getProductInfo.service, {
        getProductById: getProductById,
    });
    server.bindAsync(
        `0.0.0.0:${process.env.PRODUCT_GRPC_SERVER_PORT}`,
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
