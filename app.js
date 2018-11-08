
$(document).ready(function(){

  $('#test').click(function(){
    $.get('/testing', logger);
  });

  $('#payment').click(function(){
    $.get('/payments/create', approvePayment);
  });

  $('#find').click(function(){
    $.get('/payments/find', logger);
  });

  $('#refund').click(function(){
    var paymentId = $('#paymentId').val();
    $.get('/payments/refund/' + paymentId, logger);
  });

  $('#findRef').click(function(){
    $.get('/refunds/find', logger);
  });

  function approvePayment(data){
    logger(data);
    var id = data.body.payment.id;
    $.get('/payments/approve/' + id, logger);
  };

  function logger(x){
    console.log(x.body);
  };
});
