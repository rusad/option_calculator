$(document).ready(function()
{
  function impliedVolatility(type, spot, strike, time, rate, price, div_yield)
	{
		var accuracy = 0.001;
		var max_iterations = 1000;
		var initial_value = 0;
		while (max_iterations-- > 0) {
      var bsm = new BSM(spot, strike, time, rate, initial_value, div_yield);
      var reference = bsm.optionPrice(type, initial_value);
			if (price - reference <= accuracy) {
				return initial_value;
			}
			initial_value+=1;
		}
	}

  $('#go_premium').submit(function(e)
  {
    e.preventDefault();
    var spot = parseFloat($('#spot').val());
    var strike = parseFloat($('#strike').val());
    var time = parseFloat($('#T').val());
    var rate = parseFloat($('#rate').val());
    var sigma = parseFloat($('#sigma').val());
    var div_yield = parseFloat($('#div_yield').val());
    var type = $("#option_type").val();

    var bsm = new BSM(spot, strike, time, rate, sigma, div_yield);
    $('#premium').val(Math.round(bsm.optionPrice(type, sigma) * 100) / 100);

    $('#delta').val(Math.round(bsm.delta(type, sigma) * 100) / 100);
    $('#gamma').val(Math.round(bsm.gamma(sigma) * 100) / 100);
    $('#theta').val(Math.round(bsm.theta(type, sigma) * 100) / 100);
    $('#vega').val(Math.round(bsm.vega(sigma) * 100) / 100);

    /*var price = bsm.optionPrice(type, sigma);
    var iv = bsm.impliedVolatility(type, price);
    $('#iv').val(Math.round(iv * 100) / 100);
    $('#iv_delta').val(Math.round(bsm.delta(type, iv) * 100) / 100);
    $('#iv_gamma').val(Math.round(bsm.gamma(iv) * 100) / 100);
    $('#iv_theta').val(Math.round(bsm.theta(type, iv) * 100) / 100);
    $('#iv_vega').val(Math.round(bsm.vega(iv) * 100) / 100);*/

  });

  $('#go_iv').submit(function(e)
  {
    e.preventDefault();
    var spot = parseFloat($('#iv_spot').val());
    var strike = parseFloat($('#iv_strike').val());
    var time = parseFloat($('#iv_T').val());
    var rate = parseFloat($('#iv_rate').val());
    var price = parseFloat($('#iv_premium').val());
    var div_yield = parseFloat($('#iv_div_yield').val());
    var type = $("#iv_option_type").val();

    var iv = impliedVolatility(type, spot, strike, time, rate, price, div_yield);
    
    var bsm = new BSM(spot, strike, time, rate, iv, div_yield);

    var premium = bsm.optionPrice(type, iv);

    $('#iv').val(Math.round(iv * 100) / 100);
    $('#iv_delta').val(Math.round(bsm.delta(type, iv) * 100) / 100);
    $('#iv_gamma').val(Math.round(bsm.gamma(iv) * 100) / 100);
    $('#iv_theta').val(Math.round(bsm.theta(type, iv) * 100) / 100);
    $('#iv_vega').val(Math.round(bsm.vega(iv) * 100) / 100);

  });
});
