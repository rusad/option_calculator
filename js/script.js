function BSM(spot, strike, time, rate, sigma, div_yield)
{
  this.spot = spot;
  this.strike = strike;
  this.time = time;
  this.rate = rate / 100;
  this.sigma = sigma / 100;
  this.div_yield = div_yield / 100 || 0;

  var self = this;

  self.d1 = (Math.log(self.spot / self.strike) + (self.rate - self.div_yield + 0.5 * Math.pow(self.sigma, 2)) * self.time)/(self.sigma * Math.sqrt(self.time));

  self.d2 = (Math.log(self.spot / self.strike) + (self.rate - self.div_yield - 0.5 * Math.pow(self.sigma,2)) * self.time)/(self.sigma*Math.sqrt(self.time));

  //приватыне методы
  var normalcdf = function(mean, sigma, to) //нормстрасп в экселе
  {
    var z = (to - mean) / Math.sqrt(2 * sigma * sigma);
    var t = 1 / (1 + 0.3275911 * Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    var sign = 1;
    if(z < 0) {
      sign = -1;
    }
    return (1 / 2) * (1 + sign * erf);
  }

  var normalpdf = function(mean, sigma, to)
  {
    var e = Math.exp(-Math.pow((to - mean)/sigma, 2) / 2);
    var m = sigma * Math.sqrt(2 * Math.PI);
    return e / m;
  }

  this.optionPrice = function(type)
  {
    if (type == 'Call Option') {
      var n1 = normalcdf(0, 1, self.d1);
      var n2 = normalcdf(0, 1, self.d2);
      return self.spot * Math.exp(-self.div_yield * self.time) * n1 - self.strike * Math.exp(-self.rate * self.time) * n2;
    } else if (type == 'Put Option') {
      var n1 = normalcdf(0, 1, -self.d1);
      var n2 = normalcdf(0, 1, -self.d2);
      return self.strike * Math.exp(-self.rate * self.time) * n2 - self.spot * Math.exp(-self.div_yield * self.time) * n1;
    }
  }

  this.delta = function(type)
  {
    var n1 = normalcdf(0, 1, self.d1);
    if (type == 'Call Option') {
      return Math.exp(-self.div_yield * self.time) * n1;
    } else if (type == 'Put Option') {
      return Math.exp(-self.div_yield * self.time) * (n1 - 1);
    }
  }

  this.gamma = function()
  {
    var pdf = normalpdf(0, 1, self.d1);
    return (pdf * Math.exp(-self.div_yield * self.time)) / (self.spot * self.sigma * Math.sqrt(self.time));
  }

  this.theta = function(type) //возвращает годовое значение, для получения дневного нужно разделить на 365
  {
    var pdf = normalpdf(0, 1, self.d1);
    if (type == 'Call Option') {
      var n1 = normalcdf(0, 1, self.d1);
      var n2 = normalcdf(0, 1, self.d2);
      return -(self.spot * pdf * self.sigma * Math.exp(-self.div_yield * self.time) / (2 * Math.sqrt(self.time))) + self.div_yield * self.spot * n1 * Math.exp(-self.div_yield * self.time) - self.rate * self.strike * Math.exp(-self.rate * self.time) * n2;
    } else if (type == 'Put Option') {
      var n1 = normalcdf(0, 1, -self.d1);
      var n2 = normalcdf(0, 1, -self.d2);
      return -(self.spot * pdf * self.sigma * Math.exp(-self.div_yield * self.time) / (2 * Math.sqrt(self.time))) - self.div_yield * self.spot * n1 * Math.exp(-self.div_yield * self.time) + self.rate * self.strike * Math.exp(-self.rate * self.time) * n2;
    }
  }

  this.vega = function()
  {
    var pdf = normalpdf(0, 1, self.d1);
    return self.spot * Math.sqrt(self.time) * pdf * Math.exp(-self.div_yield * self.time);
  }
}
