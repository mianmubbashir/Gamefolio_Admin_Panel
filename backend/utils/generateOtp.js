function generateOTP(length) {
  length = length || 4; // Default length is 4 if not provided
  var min = Math.pow(10, length - 1);
  var max = Math.pow(10, length) - 1;
  var otp = Math.floor(min + Math.random() * (max - min + 1));
  return otp.toString(); // Convert the number to a string
}

module.exports = generateOTP;
