const { StatusCodes } = require("http-status-codes");
const axios = require("axios");
const crypto = require("crypto");
const { BAD_REQUEST } = require("../middleware/customErrors");

const getAllDonations = async (req, res) => {
  try {
    const donorEmail = "alfurqanaim@gmail.com";
    const apiKey = process.env.DONOR_API_KEY;

    if (!apiKey) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error:
          "API key is missing or incorrrect. Please check your environment variables.",
      });
    }
    //  console.log(req.query);
    const {
      page = 1,
      limit = 5,
      email,
      date_from,
      date_to,
      campaign_name,
      campaign_id,
      id,
      first_name,
      last_name,
      donor_id,
      amount_min,
      amount_max,
    } = req.query;

    let donorboxApiUrl = `https://donorbox.org/api/v1/donations?page=${Number(
      page
    )}&per_page=${Number(limit)}`;

    const queryParams = {
      email,
      date_from,
      date_to,
      campaign_name,
      campaign_id,
      id,
      first_name,
      last_name,
      donor_id,
    };

    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "email":
          donorboxApiUrl += value ? `&email=${encodeURIComponent(value)}` : "";
          break;
        case "date_from":
          donorboxApiUrl += value
            ? `&date_from=${encodeURIComponent(value)}`
            : "";
          break;
        case "date_to":
          donorboxApiUrl += value
            ? `&date_to=${encodeURIComponent(value)}`
            : "";
          break;
        case "campaign_name":
          donorboxApiUrl += value
            ? `&campaign_name=${encodeURIComponent(value)}`
            : "";
          break;
        case "campaign_id":
          donorboxApiUrl += value ? `&campaign_id=${Number(value)}` : "";
          break;
        case "id":
          donorboxApiUrl += value ? `&id=${Number(value)}` : "";
          break;
        case "first_name":
          donorboxApiUrl += value
            ? `&first_name=${encodeURIComponent(value)}`
            : "";
          break;
        case "last_name":
          donorboxApiUrl += value
            ? `&last_name=${encodeURIComponent(value)}`
            : "";
          break;
        case "donor_id":
          donorboxApiUrl += value ? `&donor_id=${Number(value)}` : "";
          break;
        default:
          break;
      }
    }

    // Handle amount filters separately
    if (amount_min || amount_max) {
      donorboxApiUrl += "&amount[usd]=";
      if (amount_min) donorboxApiUrl += `[min]=${Number(amount_min)}`;
      if (amount_max)
        donorboxApiUrl += `${amount_min ? "&" : ""}[max]=${Number(amount_max)}`;
    }
    const config = {
      method: "GET",
      url: donorboxApiUrl,
      auth: {
        username: donorEmail,
        password: apiKey,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios(config);
    res.status(StatusCodes.OK).json({ donations: response.data });
  } catch (error) {
    console.error("Error fetching campaigns:", error.message);
    res
      .status(error.response?.status || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.response?.data || "Failed to fetch campaigns" });
  }
};

const getAllDonors = async (req, res) => {
  try {
    const donorEmail = "alfurqanaim@gmail.com";
    const apiKey = process.env.DONOR_API_KEY;

    if (!apiKey) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error:
          "API key is missing or incorrrect. Please check your environment variables.",
      });
    }
    // console.log(req.query);
    const { page = 1, limit = 5, first_name, last_name, id, email } = req.query;
    let donorboxApiUrl = `https://donorbox.org/api/v1/donors?page=${Number(
      page
    )}&per_page=${Number(limit)}`;

    const queryParams = { id, email, first_name, last_name };

    for (const [key, value] of Object.entries(queryParams)) {
      switch (key) {
        case "id":
          donorboxApiUrl += value ? `&id=${Number(value)}` : "";
          break;
        case "email":
          donorboxApiUrl += value ? `&email=${encodeURIComponent(value)}` : "";
          break;
        case "first_name":
          donorboxApiUrl += value
            ? `&first_name=${encodeURIComponent(value)}`
            : "";
          break;
        case "last_name":
          donorboxApiUrl += value
            ? `&last_name=${encodeURIComponent(value)}`
            : "";
          break;
        default:
          break;
      }
    }
    const config = {
      method: "GET",
      url: donorboxApiUrl,
      auth: {
        username: donorEmail,
        password: apiKey,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios(config);
    res.status(StatusCodes.OK).json({ donors: response.data });
  } catch (error) {
    console.error("Error fetching campaigns:", error.message);
    res
      .status(error.response?.status || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.response?.data || "Failed to fetch campaigns" });
  }
};

const donationwebhook = async (req, res) => {
  // console.log("Webhook received:", req.body);
  const donorboxSignature = req.headers["donorbox-signature"];
  // console.log(donorboxSignature);
  if (!donorboxSignature) {
    throw new BAD_REQUEST(
      "Unauthorized request, Missing Donorbox-Signature header "
    );
  }
  // Step 1: Extract timestamp and signature
  const [timestamp, receivedSignature] = donorboxSignature.split(",");
  if (!timestamp || !receivedSignature) {
    throw new BAD_REQUEST(
      "Unauthorized request, Invalid Donorbox-Signature format "
    );
  }

  // Step 2: Generate the verification string
  const verificationString = `${timestamp}.${req.rawBody}`;
  // const verificationString = `${timestamp}.${receivedSignature}`;
  // console.log(verificationString);
  // Step 3: Compute the expected signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.SIGNATURE_SECRET)
    .update(verificationString)
    .digest("hex");
  // console.log(expectedSignature, receivedSignature);
  // Step 4: Validate the signature
  if (expectedSignature !== receivedSignature) {
    throw new BAD_REQUEST("Unauthorized request, Invalid signature");
  }

  // Step 5: Check the timestamp
  const receivedTime = parseInt(timestamp, 10);
  const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  if (Math.abs(currentTime - receivedTime) > 60) {
    // Allowable difference: 1 minute
    throw new BAD_REQUEST(
      "Unauthorized request, Request timestamp out of bounds"
    );
  }

  console.log("Webhook validated successfully:", req.body);

  // Emit the event to the frontend
  const { type, data } = req.body;
  io.emit("newDonation", data);

  res.status(200).send("Webhook received successfully");
};

module.exports = {
  getAllDonations,
  getAllDonors,
  donationwebhook,
};
