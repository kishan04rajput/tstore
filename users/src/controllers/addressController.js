import addressModel from "../models/addressModel.js";

export const addAddress = async (req, res) => {
  const { address } = req.body;

  try {
    const presentAddress = await addressModel.findOne({
      userId: req.params.id,
    });
    // console.log("presentAddress\n", presentAddress);

    if (!presentAddress) {
      const newAddress = new addressModel({
        userId: req.params.id,
        address: address,
      });
      await newAddress.save();
      res.status(200).send("New Address Created!");
    } else {
      presentAddress.address.push(address);
      await presentAddress.save();
      res.status(200).send("New Address Added!");
    }
  } catch (err) {
    console.log("err\n", err);
    res.status(400).send(err);
  }
};

export const deleteAddress = async (req, res) => {
  const { id, addressId } = req.params;

  try {
    const presentAddress = await addressModel.findOne({ userId: id });

    if (!presentAddress) {
      return res.status(404).send("Address document not found for the user.");
    }

    const addressIndex = presentAddress.address.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).send("Specific address not found.");
    }

    presentAddress.address.splice(addressIndex, 1);
    await presentAddress.save();

    res.status(200).send("Address deleted successfully.");
  } catch (err) {
    console.log("err\n", err);
    res.status(400).send(err);
  }
};

export const updateAddress = async (req, res) => {
  const { id, addressId } = req.params;
  const { address } = req.body;

  try {
    const presentAddress = await addressModel.findOne({ userId: id });

    if (!presentAddress) {
      return res.status(404).send("Address document not found for the user.");
    }

    const addressIndex = presentAddress.address.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).send("Specific address not found.");
    }

    // Update the specific address with new details
    presentAddress.address[addressIndex] = {
      ...presentAddress.address[addressIndex],
      ...address,
    };

    await presentAddress.save();

    res.status(200).send("Address updated successfully.");
  } catch (err) {
    console.log("err\n", err);
    res.status(400).send(err);
  }
};

export const getAddresses = async (req, res) => {
  const { id } = req.params;

  try {
    const presentAddress = await addressModel.findOne({ userId: id });

    if (!presentAddress) {
      return res.status(404).send("Address document not found for the user.");
    }

    res.status(200).json(presentAddress.address);
  } catch (err) {
    console.log("err\n", err);
    res.status(400).send(err);
  }
};
