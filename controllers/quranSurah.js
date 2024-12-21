const { quran_surahs: QURAN } = require("../models");
const { BAD_REQUEST, NOT_FOUND } = require("../middleware/customErrors");
const { StatusCodes } = require("http-status-codes");

const addSurah = async (req, res) => {
  const { surah, verse, translation, transliteration, text } = req.body;
  if (!surah || !verse || !translation || !transliteration || !text) {
    throw new BAD_REQUEST("some field inputs are missing");
  }
  await QURAN.create({ ...req.body });
  res.status(StatusCodes.OK).json({ msg: "surah added successfully" });
};
const getSurah = async (req, res) => {
  const surah = await QURAN.findAll({});
  res.status(StatusCodes.OK).json({ surah });
};
const updateSurah = async (req, res) => {
  const { surah_id } = req.params;
  const surah = await QURAN.findOne({ where: { surah_id } });
  if (!surah) {
    throw new NOT_FOUND(`There is no surah with an id of ${surah_id}`);
  }
  await QURAN.update(req.body, {
    where: { surah_id },
  });
  res.status(StatusCodes.OK).json({ msg: "QURAN updated successfully" });
};

module.exports = { addSurah, getSurah, updateSurah };
