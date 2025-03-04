const { StatusCodes } = require("http-status-codes");
const axios = require("axios");

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

module.exports = {
  getAllDonations,
  getAllDonors,
};
