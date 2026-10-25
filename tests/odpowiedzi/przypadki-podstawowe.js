// [wpis, odpowiedź, typ, oczekiwane: "ok" | "no" | "ai" (decyzja AI) | "notok" (no albo AI)]
const T=[ // [typed, answer, type, oczekiwane: "ok" | "no" | "ai" ("" – decyzja AI) | "notok" (no albo ai)]
["(a-b)²","(a+b)²","qa","notok"],["(a+b)^2","(a+b)²","qa","ok"],["b^2+2ab+a^2","a² + 2ab + b²","qa","ok"],["a²+2ba+b²","a² + 2ab + b²","qa","ok"],
["a²-2ab+b²","a² + 2ab + b²","qa","notok"],["(a+b)(a-b)","a² − b² = (a − b)(a + b)","qa","ok"],["(b+a)(a-b)","(a − b)(a + b)","qa","ok"],
["(a+b)²=a²+2ab+b²","a² + 2ab + b²","qa","ok"],["a²+2ab+b²","(a + b)² = a² + 2ab + b²","qa","ok"],["a2+2ab+b2","a² + 2ab + b²","qa","ok"],
["x>=3","x ≥ 3","qa","ok"],["x>3","x ≥ 3","qa","notok"],["(3;5)","⟨3; 5)","qa","notok"],["53","53₈","qa","ok"],["17","10001₂ (11 + 6 = 17)","qa","notok"],["nie wiem","1939","qa","notok"],
["1944","1944","qa","ok"],["1945","1944","qa","no"],["w 1939","1939","qa","ok"],["966r","966 r.","qa","ok"],["966","966 r.","qa","ok"],
["XV w.","XV wiek","qa","ok"],["15 wiek","XV w.","qa","ok"],["XIV wiek","XV wiek","qa","notok"],["VIII w. p.n.e.","VIII w. n.e.","qa","notok"],
["x=5","5","qa","ok"],["3,5","3.5","qa","ok"],["-3","3","qa","notok"],
["krakow","Kraków","qa","ok"],["mitochondirum","mitochondrium","qa","ok"],["chloroplast","mitochondrium","qa","notok"],
["chlor, sod","sód, chlor","qa","ok"],["sod i chlor","sód, chlor","qa","ok"],["sód","sód, chlor","qa","notok"],
["Hund","der Hund","vocab","notok"],["die Hund","der Hund","vocab","notok"],["der Hund","der Hund","vocab","ok"],["Hand","Hund","vocab","notok"],
["die Katze","der Hund","vocab","notok"],["schnell","szybki","vocab","notok"],["wesoly","wesoły, radosny","vocab","ok"],["radosny","wesoły, radosny","vocab","ok"],
["H2O","H₂O","qa","ok"],["H2O2","H₂O","qa","notok"],["tlenek żelaza(II)","tlenek żelaza(III)","qa","notok"],["tlenek zelaza(III)","tlenek żelaza(III)","qa","ok"],
["Mieszko I","Mieszko I (pierwszy władca Polski)","qa","ok"],["fotosynteza","fotosynteza (proces w chloroplastach)","qa","ok"],
["w komórce mitochondria wytwarzają energię","Mitochondria wytwarzają energię w komórce","qa","ai"],
["mitochondria nie wytwarzają energii","Mitochondria wytwarzają energię w komórce","qa","notok"],
["zachód","wschód","qa","notok"],["Kopernik","Mikołaj Kopernik","qa","notok"],
];
module.exports = T;
