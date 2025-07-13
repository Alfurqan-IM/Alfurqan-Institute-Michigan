const { campaigns_aim: Campaign } = require("../models");
const { BAD_REQUEST, NOT_FOUND } = require("../middleware/customErrors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");
const createCampaign = async (req, res) => {
  const { title, description, donation_url } = req.body;
  if (!title || !description || !donation_url) {
    throw new BAD_REQUEST("some field inputs are missing");
  }
  await Campaign.create({ ...req.body });
  res.status(StatusCodes.OK).json({ msg: "campaign created successfully" });
};
const getAllCampaigns = async (req, res) => {
  const totalCampaign = await Campaign.count();
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const numOfPages = Math.ceil(totalCampaign / limit);
  const campaigns = await Campaign.findAll({ limit, offset });
  res.status(StatusCodes.OK).json({
    campaigns,
    currentCount: campaigns.length,
    numOfPages,
    totalCampaign,
  });
};

const uploadCampaignImg = async (req, res) => {
  const campaign_img = req.files.image;
  //   console.log(campaign_img);
  const { campaign_id } = req.params;
  //   console.log(campaign_img);
  if (!campaign_img.mimetype.startsWith("image")) {
    throw new BAD_REQUEST("please upload an image");
  }
  const maxSize = 2000 * 3000;
  if (campaign_img.size > maxSize) {
    throw new BAD_REQUEST("uploaded files should not be more than 18mb");
  }
  const campaign = await Campaign.findOne({
    where: { campaign_id },
  });
  if (!campaign)
    throw new NOT_FOUND(
      `Campaign with id ${campaign_id} does not exist, create campaign first !!! `
    );
  const currentPublicId = campaign.image_public_id;
  if (currentPublicId) {
    await cloudinary.uploader.destroy(currentPublicId);
  }
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "AIM campaign's Images",
    }
  );
  // console.log(result);
  campaign.image_url = result.secure_url;
  campaign.image_public_id = result.public_id;
  await campaign.save();
  res.status(StatusCodes.OK).json({
    image_url: {
      src: result.secure_url,
    },
  });
  fs.unlinkSync(req.files.image.tempFilePath);
};
const updateCampaign = async (req, res) => {
  const { campaign_id } = req.params;
  const campaign = await Campaign.findOne({ where: { campaign_id } });
  if (!campaign) {
    throw new NOT_FOUND(`There is no campaign with an id of ${campaign_id}`);
  }
  await Campaign.update(req.body, {
    where: { campaign_id },
  });
  res.status(StatusCodes.OK).json({ msg: "Campaign updated successfully" });
};
const removeCampaign = async (req, res) => {
  const { campaign_id } = req.params;
  const campaign = await Campaign.findOne({ campaign_id });
  if (!campaign) {
    throw new NOT_FOUND(`There is no campaign with the is ${campaign_id}`);
  }
  await campaign.destroy(); //remove is deprecated
  res.status(StatusCodes.OK).json({
    msg: `campaign with the id of ${campaign_id} has been deleted successfully`,
  });
};

// const getAllCampaignsDonor = async (req, res) => {
//   const email = "alfurqanaim@gmail.com";
//   const apiKey = process.env.API_KEY;
//   const donorboxApiUrl = `https://donorbox.org/api/v1/campaigns?page=${
//     Number(req.query.page) || 1
//   }&per_page=${Number(req.query.limit) || 5}`;
//   const config = {
//     method: "GET",
//     url: donorboxApiUrl,
//     auth: {
//       username: email,
//       password: apiKey,
//     },
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };

//   const response = await axios(config);
//   res.status(StatusCodes.OK).json({ campaigns: response });
// };
const getAllCampaignsDonor = async (req, res) => {
  try {
    const email = "alfurqanaim@gmail.com";
    const apiKey = process.env.DONOR_API_KEY;

    if (!apiKey) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error:
          "API key is missing or incorrrect. Please check your environment variables.",
      });
    }
    const { page = 1, limit = 5, id, name } = req.query;
    let donorboxApiUrl = `https://donorbox.org/api/v1/campaigns?page=${Number(
      page
    )}&per_page=${Number(limit)}`;

    if (id) {
      donorboxApiUrl += `&id=${Number(id)}`;
    }

    if (name) {
      donorboxApiUrl += `&name=${encodeURIComponent(name)}`;
    }
    const config = {
      method: "GET",
      url: donorboxApiUrl,
      auth: {
        username: email,
        password: apiKey,
      },
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios(config);

    // ✅ Filter: Only campaigns that have a goal amount
    const campaignsOnly = response.data.filter(
      (c) => c.goal_amt !== null
    );
    res.status(StatusCodes.OK).json({ campaigns: campaignsOnly });
  } catch (error) {
    console.error("Error fetching campaigns:", error.message);
    res
      .status(error.response?.status || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.response?.data || "Failed to fetch campaigns" });
  }
};
module.exports = {
  getAllCampaigns,
  createCampaign,
  uploadCampaignImg,
  updateCampaign,
  removeCampaign,
  getAllCampaignsDonor,
};
