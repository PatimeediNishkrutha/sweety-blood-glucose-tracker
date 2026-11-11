export function notFound(req, res) {
  res.status(404).json({ message: "Route not found." });
}

export function errorHandler(error, req, res, next) {
  console.error(error);
  if (error?.code === "P2002") {
    return res.status(409).json({ message: "A reading already exists for this date and time slot." });
  }
  if (error?.code === "P2025") {
    return res.status(404).json({ message: "The requested record was not found." });
  }
  return res.status(500).json({ message: "Something went wrong. Please try again." });
}
