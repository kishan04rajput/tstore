import {
    loadPackageDefinition,
    credentials,
  } from "@grpc/grpc-js";
  import { loadSync } from "@grpc/proto-loader";

  const UserGRPCconnection = () => {
    const definition = loadSync("../proto/user.proto");
    const userProto = loadPackageDefinition(definition);
    
    const connection = new userProto.authencationService(
      `0.0.0.0:${process.env.USER_GRPC_SERVER_PORT}`,
      credentials.createInsecure()
    );

    return connection;
  }

  const ProductGRPCconnection = () => {
    const definition = loadSync("../proto/product.proto");
    const productProto = loadPackageDefinition(definition);
    
    const connection = new productProto.getProductInfo(
      `0.0.0.0:${process.env.PRODUCT_GRPC_SERVER_PORT}`,
      credentials.createInsecure()
    );

    return connection;
  }


  function authenticateUserByAccessToken(accessToken) {
    return new Promise((resolve, reject) => {
      const connection = UserGRPCconnection();
      connection.authenticateUserByAccessToken({ accessToken: accessToken }, (err, userObj) => {
        if (err) {
          return reject(err);
        }
        resolve(userObj);
      });
    });
  }

  function getProductById(productId) {
    return new Promise((resolve, reject) => {
      const connection = ProductGRPCconnection();
      connection.getProductById({ id: productId }, (err, productObj) => {
        if (err) {
          return reject(err);
        }
        resolve(productObj);
      });
    });
  }


  export {authenticateUserByAccessToken, getProductById};


