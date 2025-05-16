// розрахунок для першого калькулятора
function calculate1() {
    // Отримання значень від користувача
    var hp = document.getElementById("hp").value;
    var cp = document.getElementById("cp").value;
    var sp = document.getElementById("sp").value;
    var np = document.getElementById("np").value;
    var op = document.getElementById("op").value;
    var wp = document.getElementById("wp").value;
    var ap = document.getElementById("ap").value;

    // Обчислення коефіцієнтів переходу
    var krs = 100 / (100 - wp);
    var krg = 100 / (100 - wp - ap);

    // Визначення складу сухої маси палива
    var hs = hp * krs;
    var cs = cp * krs;
    var ss = sp * krs;
    var ns = np * krs;
    var os = op * krs;
    var as = ap * krs;

    // Визначення складу горючої маси палива
    var hg = hp * krg;
    var cg = cp * krg;
    var sg = sp * krg;
    var ng = np * krg;
    var og = op * krg;

    // Визначення нижчої теплоти згоряння для робочої маси
    var qrn = (339 * cp + 1030 * hp - 108.8 * (op - sp) - 25 * wp) / 1000;
    var qf = qrn;
    var qrg = (qrn + 0.025 * wp) * (100/( 100- wp - ap));

    // Визначення нижчої теплоти згоряння для сухої маси
    var qd = (qf + 0.025 * wp) *(100 /(100- wp));

    // Вивід результатів
    document.getElementById("result1").innerHTML = "Результат: <br> Коефіцієнт переходу від робочої до сухої маси = " + krs.toFixed(2)  + "<br> Коефіцієнт переходу від робочої до горючої маси = " + krg.toFixed(2)  + "<br> Склад сухої маси палива становитиме: Hc= " + hs.toFixed(2) +"%; Cc=" + cs.toFixed(2) + "%; Ss=" + ss.toFixed(2) +"%; Ns=" + ns.toFixed(2) +"%; Os=" + os.toFixed(2) + "%; As=" + as.toFixed(2) +"%;"+ "<br> Склад горючої маси палива становитиме: Hc= " + hg.toFixed(2) +"%; Cc=" + cg.toFixed(2) + "%; Ss=" + sg.toFixed(2) +"%; Ns=" + ng.toFixed(2) +"%; Os=" + og.toFixed(2) + "%;"+"<br> Нижча теплота згоряння для робочої маси за заданим складом компонентів палива становить: " + qrn.toFixed(4) + "МДж/кг"+"<br> Нижча теплота згоряння для сухої маси за заданим складом компонентів палива становить:" + qd.toFixed(2)  +"МДж/кг"+  "<br> Нижча теплота згоряння для горючої маси за заданим складом компонентів палива становить:" + qrg.toFixed(1)+"МДж/кг";
}

// розрахунок для другого калькулятора
function calculate2() {
    // Отримання значень від користувача
    var cf = document.getElementById("cf").value;
    var hf = document.getElementById("hf").value;
    var of = document.getElementById("of").value;
    var sf = document.getElementById("sf").value;
    var x1 = document.getElementById("x1").value; // нижча теплота згоряння горючої маси мазуту, МДж/кг
    var x2 = document.getElementById("x2").value; // вологість робочої маси палива,%
    var x3 = document.getElementById("x3").value; // зольність сухої маси,%
    var v = document.getElementById("v").value; // вміст ванадію (V), мг/кг

    // Обчислення коефіцієнтів переходу
    var solut1 = (100 - x2 - x3) / 100;
    var solut2 = (100 - x2) / 100;

    // Визначення складу робочої маси мазуту
    cf2 = cf * solut1;
    hf2 = hf * solut1;
    of2 = of * solut1;
    sf2 = sf * solut1;
    x32 = x3 * solut2;
    v2 = v * solut2;

    // Обчислення теплоти згоряння мазуту для робочої маси2
    Q = x1 * ((100 - x2 - x32) / 100) - 0.025 * x2;

    // Вивід результатів
    document.getElementById("result2").innerHTML = "Результат: <br> Склад робочої маси мазуту становитиме: Cf= " + cf2.toFixed(2) +"%; Hf=" + hf2.toFixed(2) + "%; Sf=" + sf2.toFixed(2) +"%; Of=" + of2.toFixed(2) +"%; V=" + v2.toFixed(2) + "мг/кг; Af=" + x32.toFixed(2) +"%;"+ "<br> Нижча теплота згоряння мазуту на робочу масу для робочої маси за заданим складом компонентів палива становить:" + Q.toFixed(1)+"МДж/кг";
}