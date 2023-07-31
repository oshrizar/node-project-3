const Card = require("./Card");

const createCard = (cardToSave) => {
  let card = new Card(cardToSave);
  return card.save();
};

const getAllCards = () => {
  return Card.find();
};

const getCardById = (id) => {
  return Card.findById(id);
};

const getCardByBizNumber = (bizNumber) => {
  return Card.findOne({ bizNumber }, { bizNumber: 1, _id: 0 });
};

const getMyCards = (userId) => {
  return Card.find(userId);
};

const updateCard = (id, cardToUpdate) => {
  return Card.findByIdAndUpdate(id, cardToUpdate, {
    new: true,
  });
};

const updateCardBiz = async (bizNumber, bizNumberToUpdat) => {
  const update = {
    $set: {
      bizNumber: bizNumberToUpdat,
    },
  };
  return Card.findOneAndUpdate({ bizNumber }, update, {
    new: true,
  });
};

const deleteCard = (id) => {
  return Card.findByIdAndDelete(id);
};

module.exports = {
  createCard,
  getAllCards,
  getCardById,
  getCardByBizNumber,
  updateCard,
  deleteCard,
  getMyCards,
  updateCardBiz,
};
