var activeUser = [];
var currentUser = '';
var products = []; //Firebase Database
var users = []; //Firebase Database
var productNames = []; //Firebase Database
var productPrices = []; //Firebase Database
var loader = true;
function load(){
  if(loader){
    loader = false;
    $('#p2').hide()
  }
  else{
    load = true;
    $('#p2').show()
  }
}
var database = firebase.database();
database.ref('users').once('value').then(function(snapshot){
  var data =  snapshot.val();
  users = Object.keys(data)
  $.each(users, function(i,x){
    //x is user name
    $item = $('<a class="mdl-navigation__link user" id="a_' + x + '">' + x+  ' <i class="material-icons" style="vertical-align: middle; float: right;">more_vert</i></a>')
    $('.mdl-navigation').append($item)
  })
  load()

  $('.user').on('click', function(){
    currentUser = $(this).attr('id').substring(2)
    $('#usertitle').html(' &rarr; ' + currentUser)
    loadBill()
  })
})
database.ref('Products/').once('value').then(function(snapshot){
  var data =  snapshot.val();
  products = data
  console.log(products)
})
database.ref('Product_names/').once('value').then(function(snapshot){
  productNames = snapshot.val()
})
database.ref('Product_prices/').once('value').then(function(snapshot){
  productPrices = snapshot.val()
})

function loadBill(){
  database.ref('users/' + currentUser).once('value').then(function(snapshot){
    var data =  snapshot.val();
    $('#billList').empty()
    var due = 0;
    for(var i in data){
      if(data[i] > 0){
        $('#billList').append('<li class="mdl-list__item"> ' + productNames[i] + ' : ' + data[i])
        due += data[i] * productPrices[i]
      }
    }
    $('#due-amount').text(due.toFixed(2))
  })
}
$('.product').on('click', function(){
  var product = $(this).attr('id')
  console.log(product)
  for(var i in products){
    if(product == products[i]){
      console.log(products[i])
      break;
    }
  }
  database.ref('users/' + currentUser).once('value').then(function(snapshot){
    var userdata = snapshot.val()
    // var userdata = data.currentUser
    userdata[i] = userdata[i] + 1
    console.log(userdata)
    database.ref('users/' + currentUser).set(userdata,
       function(error){
        if(error){
          alert('wow, niet gelukt!')
        }
        else{
          loadBill()
        }
      }

    );
  })

})
