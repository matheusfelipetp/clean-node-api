export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/clean-node-api",
  port: process.env.PORT || 5050,
  jwtSecret:
    process.env.JWT_SECRET ||
    "$2a$12$OJkQmdrXYMKkF44MqT9s7..rjCb0coPmVxdXeQ8/boaJGwMXioB42",
};
