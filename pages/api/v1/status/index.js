function status(req, res) {
  res.status(200).send({ bom: "dia" });
}

export default status;
