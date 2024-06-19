function calculateFairPrice(distance) {
    if (distance <= 10) {
      return 10;
    } else {
      return distance * 2.5; 
    }
  }
  
  module.exports = {
    calculateFairPrice
  };
  