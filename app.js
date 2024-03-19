const mongoose = require("mongoose");

const { mongo, default: mongoose } = require("mongoose");
const MONGODB_URI = require("./utils/config");
const logger = require("./utils/logger");

logger.info(`Connecting to ${MONGODB_URI}`);

mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info("connected to MongoDB"))
  .catch((error) =>
    logger.error("error connecting to MongoDB: ", error.message)
  );

app.use(cors());
app.use(express.json());
