function formatMoney(t) {
  if (t < 0) {
    t = Math.abs(t);
    var e = new String(t),
      o = e.split(".", e),
      n = o[0].length,
      a = "";
    for (i = 0; i < n; i++)
      a +=
        parseFloat(n - i) % 3 == 0
          ? 0 == i
            ? e.charAt(i)
            : "," + e.charAt(i)
          : e.charAt(i);
    return void 0 != o[1] && "-" + (a += "." + o[1]), "-" + a;
  }
  if (t > 1) {
    var e = new String(t),
      o = e.split(".", e),
      n = o[0].length,
      a = "";
    for (i = 0; i < n; i++)
      a +=
        parseFloat(n - i) % 3 == 0
          ? 0 == i
            ? e.charAt(i)
            : "," + e.charAt(i)
          : e.charAt(i);
    return void 0 != o[1] && (a += "." + o[1]), a;
  }
  return t;
}
function formatNumber(t, e) {
  if ("" == t) var o = 0;
  else
    var n = t.split(","),
      o = parseFloat(n.join(""));
  return e === !0 ? o.toFixed(2) : o;
}
function onlyletter(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode(key);
  var regex = /[^0-9.,]/g;
  evt.target.value = evt.target.value.replace(regex, "");
}
function onlyletterPress(evt) {
  var theEvent = evt || window.event;
  var key = theEvent.keyCode || theEvent.which;
  var kk = key;
  key = String.fromCharCode(key);
  var regex = /[0-9.,]/;
  if (
    !regex.test(key) &&
    kk !== 8 &&
    kk !== 37 &&
    kk !== 38 &&
    kk !== 39 &&
    kk !== 40 &&
    kk !== 9 &&
    kk !== 13 &&
    kk !== 16 &&
    kk !== 17
  ) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
}
function setFormat(evt) {
  var _val = evt.target.value;
  if(!_val) _val = 0;
  var val = formatNumber(_val);
  evt.target.value = formatMoney(val.toFixed(2));
}

function fundCal(evt) {
  evt.preventDefault();
  $(".alert-missing").remove();
  var exit_type1 = document.getElementsByName("exit_type")[0].checked;
  var exit_type2 = document.getElementsByName("exit_type")[1].checked;
  var _contribution = document.getElementsByName("contribution")[0].value;
  var _accumulation = document.getElementsByName("accumulation")[0].value;
  var _contribution_benefit = document.getElementsByName(
    "contribution_benefit"
  )[0].value;
  var _accumulation_benefit = document.getElementsByName(
    "accumulation_benefit"
  )[0].value;
  var fund_age = document.getElementsByName("fund_age")[0].value;
  var age = document.getElementsByName("age")[0].value;
  var work_age = document.getElementsByName("work_age")[0].value;
  if (!exit_type1 && !exit_type2)
    $("#exit_type").append(
      '<div class="alert-missing">*กรุณากรอกข้อมูลให้ครบ</div>'
    );
  if (!_contribution)
    $("#contribution").append(
      '<div class="alert-missing">*กรุณากรอกข้อมูลให้ครบ</div>'
    );
  if (!_accumulation)
    $("#accumulation").append(
      '<div class="alert-missing">*กรุณากรอกข้อมูลให้ครบ</div>'
    );
  if (!_contribution_benefit)
    $("#contribution_benefit").append(
      '<div class="alert-missing">*กรุณากรอกข้อมูลให้ครบ</div>'
    );
  if (!_accumulation_benefit)
    $("#accumulation_benefit").append(
      '<div class="alert-missing">*กรุณากรอกข้อมูลให้ครบ</div>'
    );
  if (!fund_age)
    $("#fund_age").append(
      '<div class="alert-missing">*กรุณากรอกข้อมูลให้ครบ</div>'
    );
  if (!age)
    $("#age").append('<div class="alert-missing">*กรุณากรอกข้อมูลให้ครบ</div>');
  if (!work_age)
    $("#work_age").append(
      '<div class="alert-missing">*กรุณากรอกข้อมูลให้ครบ</div>'
    );
  if (
    (!exit_type1 && !exit_type2) ||
    !_contribution ||
    !_accumulation ||
    !_contribution_benefit ||
    !_accumulation_benefit ||
    !fund_age ||
    !age ||
    !work_age
  )
    return;

  var accumulation_benefit = formatNumber(_accumulation_benefit);
  var contribution = formatNumber(_contribution);
  var contribution_benefit = formatNumber(_contribution_benefit);

  var tax = 0;
  var taxcal_base = accumulation_benefit + contribution + contribution_benefit;

  if (exit_type2) {
    //case 1
    var discount = taxcal_base * 0.5 > 100000 ? 100000 : taxcal_base * 0.5;
    tax = taxCalType1(taxcal_base - discount);
  } else {
    if (work_age < 5) {
      //case 1
      var discount = taxcal_base * 0.5 > 100000 ? 100000 : taxcal_base * 0.5;
      tax = taxCalType1(taxcal_base - discount);
    } else {
      if (age > 55) {
        if (fund_age >= 5) {
          //case 0
          tax = 0;
        } else {
          //case 2
          var discount1 = work_age * 7000;
          var discount2 = (taxcal_base - discount1) * 0.5;
          tax = taxCalType2(taxcal_base - discount1 - discount2);
        }
      } else {
        //case 2
        var discount1 = work_age * 7000;
        var discount2 = (taxcal_base - discount1) * 0.5;
        tax = taxCalType2(taxcal_base - discount1 - discount2);
      }
    }
  }
  $("#tax-result").html(formatMoney(parseFloat(tax).toFixed(2)));
  console.log(tax, "tax");
  return;
}

function taxCalType1(val) {
  var real_income = val;
  var tax = 0;
  var cases = [
    { income: 150000, vat: 0 },
    { income: 300000, vat: 0.05 },
    { income: 500000, vat: 0.1 },
    { income: 750000, vat: 0.15 },
    { income: 1000000, vat: 0.2 },
    { income: 2000000, vat: 0.25 },
    { income: 5000000, vat: 0.3 },
    { income: 5000001, vat: 0.35 },
  ];
  for (let i = 0; i < cases.length; i++) {
    let c = cases[i];
    let last_c = i > 0 ? cases[i - 1] : { income: 0, vat: 0 };
    if (real_income > c.income) {
      tax += (c.income - last_c.income) * c.vat;
    } else {
      if (real_income - last_c.income > 0)
        tax += (real_income - last_c.income) * c.vat;
    }
  }
  return tax;
}

function taxCalType2(val) {
  var real_income = val;
  var tax = 0;
  var cases = [
    { income: 150000, vat: 0.05 },
    { income: 300000, vat: 0.05 },
    { income: 500000, vat: 0.1 },
    { income: 750000, vat: 0.15 },
    { income: 1000000, vat: 0.2 },
    { income: 2000000, vat: 0.25 },
    { income: 5000000, vat: 0.3 },
    { income: 5000001, vat: 0.35 },
  ];
  for (let i = 0; i < cases.length; i++) {
    let c = cases[i];
    let last_c = i > 0 ? cases[i - 1] : { income: 0, vat: 0 };
    if (real_income > c.income) {
      tax += (c.income - last_c.income) * c.vat;
    } else {
      if (real_income - last_c.income > 0)
        tax += (real_income - last_c.income) * c.vat;
    }
  }
  return tax;
}
