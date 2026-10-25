// 193 przypadki z recenzji 25.10: [wpis, odpowiedź, czy poprawna, opis]. Wymóg: zero fałszywych zaliczeń i zero twardych odrzuceń poprawnych.
const C=[
// runda 1
["(a-b)²","(a+b)²",0,"znak w nawiasie"],["-5","5",0,"minus"],["a2-b2","a² − b²",1,"a2-b2"],["a²+b²","a² − b²",0,"zły znak"],["x=-3","x = 3",0,"x=-3"],
["1914","1918",0,"data"],["1944","1945",0,"data"],["H2O","H2O2",0,"chem"],["tlen","tlen, wodór i azot",0,"lista część"],["Zeus","Zeus, Hera",0,"lista część"],
// wzory skróconego mnożenia
["a^2+2ab+b^2","a² + 2ab + b²",1,"^"],["b²+2ab+a²","a² + 2ab + b²",1,"kolejność sumy"],["a2 - 2ab + b2","a² − 2ab + b²",1,"bez ²"],
["a²-2ab+b²","a² + 2ab + b²",0,"zły znak środkowy"],["a² + ab + b²","a² + 2ab + b²",0,"brak 2"],["a² + 2ba + b²","a² + 2ab + b²",1,"2ba"],
["(a+b)(a-b)","a² − b²",0,"postać iloczynowa vs suma (inna postać)"],["(a-b)(a+b)","(a+b)(a−b)",1,"czynniki zamienione"],
["(a+b)^2=a^2+2ab+b^2","a² + 2ab + b²",1,"z lewą stroną"],["a*a+2*a*b+b*b","a² + 2ab + b²",0,"a*a (różna postać)"],
["a²-b²","a² − b²",1,"minus unicode"],["-b²+a²","a² − b²",1,"kolejność z minusem"],["a³ − 3a²b + 3ab² − b³","a³ − 3a²b + 3ab² − b³",1,"sześcian"],
["a3-3a2b+3ab2-b3","a³ − 3a²b + 3ab² − b³",1,"sześcian bez indeksów"],["a³+3a²b+3ab²+b³","a³ − 3a²b + 3ab² − b³",0,"sześcian zły"],
["4x²+12x+9","(2x+3)² = 4x² + 12x + 9",1,"wynik bez lewej"],["4x2+12x+9","4x² + 12x + 9",1,""],["4x²+6x+9","4x² + 12x + 9",0,"zły współczynnik"],
["9 + 12x + 4x²","4x² + 12x + 9",1,"odwrotnie"],["x²-6x+9","x² − 6x + 9",1,""],["x^2 - 6x + 9","x² − 6x + 9",1,""],
["x² + 6x + 9","x² − 6x + 9",0,"znak"],["x = 3","x = 3",1,""],["3","x = 3",1,"sama liczba"],["x=3","3",1,""],
["0,5","0.5",1,"przecinek"],["1/2","0,5",0,"inna postać (ok odrzucić)"],["-3","−3",1,"minus unicode"],
// historia
["1939","1939",1,""],["1939 r.","1939",1,""],["w 1939","1939",1,"w 1939"],["1 września 1939","1 września 1939",1,""],
["1 wrzesnia 1939","1 września 1939",1,"bez ogonków"],["1.09.1939","1 września 1939",1,"zapis cyfrowy daty"],["2 września 1939","1 września 1939",0,"zły dzień"],
["966","966 r.",1,""],["966r","966 r.",1,""],["476 n.e.","476 n.e.",1,""],["476","476 n.e.",1,""],["476 p.n.e.","476 n.e.",0,"p.n.e. vs n.e."],
["753 p.n.e.","753 p.n.e.",1,""],["753","753 p.n.e.",0,"brak p.n.e. (ścisłość)"],["V w. p.n.e.","V w. p.n.e.",1,""],["5 w. p.n.e.","V w. p.n.e.",1,"cyfry arabskie"],
["IV w. p.n.e.","V w. p.n.e.",0,"zły wiek"],["Mieszko I","Mieszko I",1,""],["mieszko 1","Mieszko I",1,"I->1"],["Mieszko II","Mieszko I",0,""],
["Bolesław Chrobry","Bolesław Chrobry",1,""],["boleslaw chrobry","Bolesław Chrobry",1,""],["chrobry","Bolesław Chrobry",1,"samo przydomek"],["Bolesław Krzywousty","Bolesław Chrobry",0,""],
["Peryklas","Perykles",1,"literówka"],["Ateny","Sparta",0,""],["sparta","Sparta",1,""],
["1410","1410 – bitwa pod Grunwaldem",1,"sama data"],
// niemiecki
["der Hund","der Hund",1,""],["Hund","der Hund",1,"bez rodzajnika?"],["die Hund","der Hund",0,"zły rodzajnik"],["das Hund","der Hund",0,"zły rodzajnik"],
["der hund","der Hund",1,"mała litera"],["Hand","der Hund",0,""],["die Katze","die Katze",1,""],["die Katz","die Katze",1,"literówka?"],["der Katze","die Katze",0,"rodzajnik"],
["das Mädchen","das Mädchen",1,""],["das Madchen","das Mädchen",1,""],["das Maedchen","das Mädchen",1,"ae"],["die Mädchen","das Mädchen",0,""],
["die Strasse","die Straße",1,"ss"],["Ich heiße Borys","Ich heiße Borys.",1,""],["Ich heise Borys","Ich heiße Borys.",1,"literówka"],
["Ich bin 15 Jahre alt","Ich bin 15 Jahre alt.",1,""],["Ich bin 16 Jahre alt","Ich bin 15 Jahre alt.",0,""],
["pies","pies",1,""],["kot","pies",0,""],["dog","dog",1,""],["Guten Morgen","Guten Morgen!",1,""],["Guten Tag","Guten Morgen!",0,""],
["wie geht es dir","Wie geht's?",1,"synonim? (niekonieczne)"],["der Bruder","der Bruder / die Brüder",1,""],["die Brüder","der Bruder / die Brüder",1,""],
// angielski
["went","went",1,""],["goed","went",0,""],["I have been","I have been",1,""],["i've been","I have been",1,"skrót"],
// chemia
["H2O","H₂O",1,"indeks unicode"],["h2o","H₂O",1,""],["CO2","CO₂",1,""],["CO","CO₂",0,""],["NaCl","NaCl",1,""],["NaCI","NaCl",0,"I zamiast l"],
["H2SO4","H₂SO₄",1,""],["H2SO3","H₂SO₄",0,""],["2H2 + O2 → 2H2O","2H₂ + O₂ → 2H₂O",1,"reakcja"],["H2 + O2 → H2O","2H₂ + O₂ → 2H₂O",0,"nieuzgodniona"],
["O2 + 2H2 → 2H2O","2H₂ + O₂ → 2H₂O",1,"substraty odwrotnie"],["tlenek węgla(IV)","tlenek węgla(IV)",1,""],["tlenek wegla IV","tlenek węgla(IV)",1,""],
["tlenek węgla(II)","tlenek węgla(IV)",0,"wartościowość"],["tlenek wegla","tlenek węgla(IV)",0,"bez wartościowości"],["chlorek sodu","chlorek sodu",1,""],["chlorek potasu","chlorek sodu",0,""],
["kwas siarkowy(VI)","kwas siarkowy(VI)",1,""],["kwas siarkowy(IV)","kwas siarkowy(VI)",0,""],["kwas siarkowy","kwas siarkowy(VI)",0,""],
["sód","Na",0,""],["Na","Na",1,""],["na","Na",1,""],["8","8",1,""],["16","8",0,""],["pH 7","7",1,""],["7","pH = 7",1,""],
["obojętny","obojętny",1,""],["kwasowy","zasadowy",0,""],["proton","proton",1,""],["neutron","proton",0,""],["elektrony","elektron",1,"liczba mnoga"],
// listy
["tlen, wodór, azot","tlen, wodór i azot",1,""],["azot, tlen, wodór","tlen, wodór i azot",1,"kolejność"],["tlen wodór azot","tlen, wodór i azot",1,"bez przecinków"],
["tlen i wodór","tlen, wodór i azot",0,"brak elementu"],["Zeus, Hera","Zeus, Hera",1,""],["Hera, Zeus","Zeus, Hera",1,""],["hera zeus","Zeus, Hera",1,""],
["Zeus, Hera, Atena","Zeus, Hera",1,"dodatkowy element (nadmiar)"],["Atena, Ares","Zeus, Hera",0,""],
["rzeczownik, czasownik","czasownik, rzeczownik, przymiotnik",0,"lista niepełna"],
// polski: opisowe, odwrócona kolejność
["Mickiewicz","Adam Mickiewicz",1,"samo nazwisko"],["Adam Mickiewicz","Adam Mickiewicz",1,""],["mickiewicz adam","Adam Mickiewicz",1,""],["Słowacki","Adam Mickiewicz",0,""],
["Juliusz Słowacki","Adam Mickiewicz",0,""],["Adam Słowacki","Adam Mickiewicz",0,"to samo imię"],
["epitet","epitet",1,""],["porównanie","epitet",0,""],["metafora","przenośnia (metafora)",1,"wariant w nawiasie"],["przenosnia","przenośnia (metafora)",1,""],
["wyraz określający rzeczownik","epitet – wyraz określający rzeczownik",0,"(może zaliczyć, dyskusyjne)"],
["Rzeczownik określa epitet","Epitet określa rzeczownik",0,"odwrócona relacja (zmiana sensu)"],
["Fotosynteza zachodzi w chloroplastach","W chloroplastach zachodzi fotosynteza",1,"odwrócona kolejność zdania"],
["Ateny pokonały Persów pod Maratonem","Pod Maratonem Ateńczycy pokonali Persów",1,"odwrócona kolejność + odmiana"],
["Persowie pokonali Ateńczyków pod Maratonem","Pod Maratonem Ateńczycy pokonali Persów",0,"odwrócony sens"],
["Bo Słońce świeci na liście i roślina robi z tego cukier","Roślina wytwarza glukozę z dwutlenku węgla i wody dzięki energii światła",0,"opis (AI)"],
["demokracja to władza ludu","Demokracja to rządy ludu",1,"synonim"],["władza ludu","rządy ludu",1,"synonim krótki"],
["rządy jednego","rządy ludu",0,""],["rządy ludu","rządy jednej osoby",0,""],["rządy jednej","rządy jednej osoby",0,"niepełne"],
["Grecy wierzyli w wielu bogów","Grecy byli politeistami (wierzyli w wielu bogów)",1,""],
["nie wierzyli w wielu bogów","wierzyli w wielu bogów",0,"negacja"],
["Kościół nie zgodził się","Kościół zgodził się",0,"negacja krótka"],
["Polska przyjęła chrzest w 966","W 966 roku Polska przyjęła chrzest",1,"zdanie z datą odwrócone"],
["Polska przyjęła chrzest w 967","W 966 roku Polska przyjęła chrzest",0,"zdanie zła data"],
["Chrzest Polski był w 966 roku","W 966 roku Polska przyjęła chrzest",1,"przeformułowanie z datą"],
["Mieszko przyjął chrzest w 966","Mieszko I przyjął chrzest w 966 r.",1,""],
["Woda wrze w 100 stopniach","Woda wrze w temperaturze 100°C",1,""],["Woda wrze w 90 stopniach","Woda wrze w temperaturze 100°C",0,""],
// cloze wielu luk
["Kraków, Wawel","Kraków, Wawel",1,""],["Wawel, Kraków","Kraków, Wawel",1,"kolejność luk – dyskusyjne"],["Kraków","Kraków, Wawel",0,""],
["1, 2","1, 2",1,""],["2, 1","1, 2",0,"luki z liczbami zamienione"],["1","1, 2",0,""],
// programowanie
["int","int",1,""],["for","while",0,""],["print('hello')","print(\"hello\")",1,"cudzysłów"],["x == 5","x == 5",1,""],["x = 5","x == 5",0,"= vs =="],
["i++","i++",1,""],["i--","i++",0,""],["<br>","<br>",1,""],["true","True",1,""],["false","True",0,""],
// pusta / śmieci
["?","1939",0,""],["nie wiem","1939",0,""],["-","5",0,""],["...","Perykles",0,""],["a","a² + b²",0,""],["2","a² + 2ab + b²",0,"sama liczba"],["2ab","a² + 2ab + b²",0,""],
["a²+b²+2ab+2","a² + 2ab + b²",0,"nadmiar"],["a² + 2ab + b² + c²","a² + 2ab + b²",0,""],
];
module.exports=C;
