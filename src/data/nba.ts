export type NbaStory = {
  id: string
  tag: string
  title: string
  blurb: string
  body: string[]
  when: string
  readMin: number
  image: string
}

export type FreeAgent = {
  id: string
  rank: number
  name: string
  position: string
  lastTeam: string
  newTeam: string
  age: string
  height: string
  weight: string
  image: string
  note: string
  detail: string[]
  fit: string
}

export type QuizQ = {
  id: string
  q: string
  choices: string[]
  answer: number
  explain: string
}

export type MambaPage = {
  title: string
  kicker: string
  lead: string
  story: string[]
  points: { h: string; p: string }[]
  quote: string
  takeaway: string
}

export const nbaUpdates: NbaStory[] = [
  {
    id: 'nba-u-26-lebron-sixers',
    tag: 'Free Agency',
    title: 'LeBron James «сүүлийн шийдвэр»-ээ зарлалаа — Philadelphia 76ers',
    blurb:
      'Lakers-ээс салсны дараа 41 настай карьерын онооны аварга хоёр жилийн veteran min гэрээгээр Sixers-т ирэв. Maxey, Embiid, Jaylen Brown-той нэг court.',
    body: [
      'LeBron James 2026 оны зун Lakers-тэй замаа салсны дараа тэтгэвэрт гарах хувилбарыг ч бодож байсан. Гэтэл 7-р сарын сүүлээр “my last decision” гэж бичиж, Philadelphia 76ers-тэй 2 жил / $8 саяын veteran min гэрээ байгуулснаа зарлав.',
      'Sixers энэ offseason-д Jaylen Brown-ийг Celtics-ээс нэмсэн. Одоо төсөөлөлд Tyrese Maxey, V.J. Edgecombe, Brown, James, Joel Embiid гэсэн starting five харагдаж байна — All-Star, MVP, Finals MVP-ийн нийлбэр маш өндөр.',
      'Асуулт нь эрүүл мэнд болон нас. Embiid-ийн availability, LeBron-ийн minutes, East-ийн physical series. Гэхдээ цаасан дээр энэ бол лигийн хамгийн чанга «win-now» төслүүдийн нэг.',
      'Newsac уншигчдад: зөвхөн нэрийг биш. Sixers 1983 оноос хойш аваргалаагүй, 2001 оноос хойш East-ийн 2-р шатнаас гарч чадаагүй. Энэ зун тэр түүхийг эвдэхээр хөдөлсөн.',
    ],
    when: '7-р сар, 2026',
    readMin: 5,
    image:
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nba-u-26-lakers-reset',
    tag: 'Lakers',
    title: 'Lakers: Reaves max, Kessler sign-and-trade — Luka-гийн хажууд шинэ core',
    blurb:
      'Austin Reaves 4 жилийн max-аар үлдлээ. Walker Kessler Utah-аас 4 жил / ~$130 саяар ирэв. LeBron явсны дараах L.A. өөр баг болж байна.',
    body: [
      'Austin Reaves player option-оо тавиад Lakers-тэй 4 жилийн maximum (~$185 сая) гэрээ байгуулав. Nets, Pistons зэрэг багууд max санал өгөх төлөвтэй байсан тул L.A. эрт түгжсэн.',
      'Төвд Walker Kessler Jazz-тай sign-and-trade-ээр 4 жил / ~$130 саяар ирэв. Rim protection + lob threat — Luka Dončić-ийн pick-and-roll-д шууд тохирох профайл.',
      'Quentin Grimes (PHI), Sandro Mamukelashvili (TOR) зэрэг нэмэлтүүд ч Lakers руу ирсэн. LeBron-ийн дараа баг «star + youth + size» руу шилжиж байна.',
      'Фэнүүдийн анхаарах зүйл: cap sheet хүндэрлээ. Reaves-ийн max нь win-now мөнгө. Дараагийн алхам бол defense identity — Kessler ганцаараа бүгдийг шийдэхгүй.',
    ],
    when: '7-р сар, 2026',
    readMin: 4,
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nba-u-26-east-board',
    tag: 'East',
    title: 'Зүүн конференц: Sixers superteam, Wizards Trae-гээ барив',
    blurb:
      'Philadelphia нэрсээ өсгөв. Washington Trae Young-ийг 4 жил / $213 саяар үлдээв. Boston Mitchell Robinson-оор paint-ээ бэхжүүллээ.',
    body: [
      'East-ийн зураг 2026 оны 7-р сард хурдтай өөрчлөгдсөн. Sixers LeBron + Jaylen Brown нэмсэн нь Celtics, Knicks, Cavs-ийн тооцоог эвдэв.',
      'Washington Wizards Trae Young-ийг 4 жил / $213 саяар үлдээв. Young rebuild-ийн «face» хэвээр — Edgecombe-той Sixers, эсвэл rising Pistons-тэй seed-ийн төлөөх тэмцэл сонирхолтой.',
      'Boston Celtics Mitchell Robinson-ийг Knicks-ээс 3 жил / ~$47 саяар авсан. Brown явсны дараа rim protection болон offensive glass хэрэгтэй байсан.',
      'Newsac take: East 1–6 бүгд «real». Paper superteam playoff-д injury-гаар унадаг. Health = standing гэж үзэх улирал болно.',
    ],
    when: '7-р сар, 2026',
    readMin: 4,
    image:
      'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nba-u-26-powell-collins',
    tag: 'Market',
    title: 'Wing market: Powell Чикагод, Collins Детройтад',
    blurb:
      'Norman Powell Heat-ээс Bulls руу 2 жил / $44 сая. John Collins Clippers-ээс Pistons руу 3 жил / $51 сая. Scoring wing-ийн үнэ тогтвортой өндөр.',
    body: [
      'Norman Powell Miami-д shot-making-ээ баталсан. Чикаго түүнийг 2 жил / ~$44 саяар авч, half-court isolation болон catch-and-shoot-оо нэмэв. Bulls-ийн direction тодорхой биш ч scoring punch нэмэгдлээ.',
      'John Collins Pistons-т 3 жил / $51 саяар ирэв. Detroit өнгөрсөн жилүүдэд young core-оо өсгөсөн — Collins roll + dunk + spacing (хирсэн бол) тэнд тохирно.',
      'Энэ хоёр гэрээ «max headline» биш. Гэхдээ playoff series-д 4-р үеийн scoring болон switching frontcourt яг ийм нэрсээр шийдэгддэг.',
      'Free Agency самбарыг Newsac дээр тогтмол шинэчилнэ. Нэр дээр дарж дэлгэрэнгүй уншина уу.',
    ],
    when: '7-р сар, 2026',
    readMin: 3,
    image:
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nba-u-26-okc-hartenstein',
    tag: 'West',
    title: 'OKC Hartenstein-ээ 3 жил / $75 саяар барив',
    blurb:
      'Isaiah Hartenstein rim + short-roll pass. Чемпионы болон contender-ийн «quiet» хэсэг яагаад үнэтэй вэ?',
    body: [
      'Oklahoma City Isaiah Hartenstein-тэй 3 жил / $75 саяар дахин тохиролцов. Энэ бол highlight гэрээ биш — championship infrastructure.',
      'Hartenstein pick-and-roll-д short roll дамжуулалт, paint deterrence, screening intelligence өгдөг. SGA-тай системд тэр «engine-ийн тос».',
      'West-д Lakers size нэмсэн, Warriors Green/Porziņģis-ээ барьсан. OKC яг одоо «яагаад цонхыг одоо хаах вэ» гэсэн асуултад мөнгөөр хариулсан.',
      'Улаанбаатарын үзэгчдэд: OKC-ийн тоглолтыг зөвхөн SGA-ийн изоляцаар битгий хар. 5-out, extra pass, big-ийн IQ — тэнд л баг ялгарна.',
    ],
    when: '7-р сар, 2026',
    readMin: 3,
    image:
      'https://images.unsplash.com/photo-1608245449230-4ac190afb580?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nba-u-26-camp-ub',
    tag: 'UB гарын авлага',
    title: '2026–27 training camp ойртож байна — UB цагаар хэрхэн үзэх вэ?',
    blurb:
      '9-р сард camp, 10-р сард regular season. Шөнө дундын tip-off, recap, Sacfun clip — Newsac хэрхэн «alive» байлгах вэ.',
    body: [
      'NBA regular season 10-р сард эхэлнэ. Ихэнх prime-time тоглолт Улаанбаатарт шөнө эсвэл өглөө эрт орно. Тиймээс бүтэн 48 минут биш — 4-р үе + postgame + өглөөний recap чухал.',
      'Энэ зун хамгийн их яригдах story: Sixers-ийн шинэ big 3/4, Lakers-ийн Luka + Reaves + Kessler, OKC-ийн repeat attempt, East-ийн нягтрал.',
      'Newsac дээр Мэдээлэл хэсэгт контекст, Free Agency самбарт нэрс, Sacfun дээр @Newsacsacfun бичлэг, Quiz-ээр мэдлэгээ шалгана.',
      'Зөвлөмж: бүтэн тоглолт үзэх боломжгүй бол box score биш — lineup, timeout, closing five. Тэнд л шөнө дундын NBA-ийн story төгсдөг.',
    ],
    when: '8-р сар, 2026',
    readMin: 4,
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'nba-u-26-mamba-why',
    tag: 'Culture',
    title: 'Яагаад Mamba Mentality одоо ч NBA ярианы төвд байдаг вэ?',
    blurb:
      'Kobe-ийн философи зөвхөн Lakers throwback биш. Load management, superteam, 41 насны LeBron — бүгд «process vs talent» асуулт.',
    body: [
      'Mamba Mentality бол slogan биш. Kobe үүнийг өөрийн ажлын систем гэж тайлбарласан: хамгийн хэцүү мөчид хамгийн сайн хувилбараа гаргах, дараагийн possession руу шилжих.',
      '2026 оны зун LeBron 24 дэх улирал руугаа орж байна. Reaves max авсан. Rookie, veteran, superteam — бүгд ижил шалгууртай: бэлтгэл, эрүүл мэнд, film.',
      'Newsac-ийн Mamba хэсэгт бид зөвхөн ишлэл биш, өдөр тутмын 4 зарчмыг Монгол хэлээр тайлбарлана. Уншаад, Quiz-тэй хольж үзээрэй.',
    ],
    when: '8-р сар, 2026',
    readMin: 3,
    image:
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
  },
]

export const mambaMentality: MambaPage = {
  title: 'Mamba Mentality гэж юу вэ?',
  kicker: 'Kobe Bryant · 1978–2020',
  lead:
    'Ялагч байхын тулд өдөр бүр өөртэйгөө тулалдах. Kobe үүнийг постер биш, өдөр тутмын систем гэж нэрлэсэн. Авъяас хаалга нээнэ. Process хаалгыг нээлттэй байлгана.',
  story: [
    'Kobe Bean Bryant 20 улирлыг бүгдийг Los Angeles Lakers-т өнгөрөөсөн. 5 удаагийн аварга, 2 удаагийн Finals MVP, 18 удаагийн All-Star. Гэхдээ Mamba Mentality статистикаас эхэлдэггүй — өглөөний бэлтгэлээс эхэлдэг.',
    'Тэр «the work»-ийг нууцалдаггүй байсан. Өрсөлдөгчөөсөө эрт заал дээр, илүү олон repetition, илүү олон film session. Нэг шидэлт алдсан ч дараагийнхийг итгэлтэйгээр шиддэг байсан нь авьяас биш, бэлтгэлийн үр.',
    '2013 онд Achilles тасарч, 2016 онд 60 оноо авч карьераа хаасан шөнө хүртэл тэр ижил хэлээр ярьсан: дарамт бол боломж. Алдаа бол дараагийн possession-ийн түлш.',
    'Монголын үзэгч, тоглогч, артист, сурагчид яг энэ хэлийг ашиглаж болно. Basketball төдийгүй ажил, сургууль, студи дээр: төлөвлө, хэмж, зас, дахин хий. Өчигдрийн алдааг өнөөдрийн repetition болго.',
  ],
  points: [
    {
      h: 'Гар урлал',
      p: 'Footwork, free throw, weak hand, film — жижиг зүйлийг мэргэжлийн түвшинд хийнэ. «Хангалттай» гэсэн цэг байхгүй. Нэг skill-ийг өдөр бүр 1% сайжруулна.',
    },
    {
      h: 'Айдасгүй төвлөрөл',
      p: 'Алдаанаас айхгүй. 4-р үеийн сүүлийн секундэд илүү тайван, илүү хурц. Айдас бол мэдээлэл — түүнийг action болгоно. Шүүмжлэл чимээгүй болгохгүй.',
    },
    {
      h: 'Дараагийн possession',
      p: 'Turnover болсон. Шидэлт алдсан. Яагаад гэдгийг секундэд тэмдэглээд урагшаа. Short memory, long vision. Өнгөрсөнд гацвал дараагийн дайралт үхнэ.',
    },
    {
      h: 'Бүхнээс илүү хичээх',
      p: 'Авъяас ганцаараа хангалтгүй. Бэлтгэл, унтах, хоол, сэргэлт, mindset — бүгд training. Recovery ч ажлын хэсэг. Outwork гэдэг нь 24 цаг шуугих биш, зөв ажиллах.',
    },
  ],
  quote:
    '«Everything negative — pressure, challenges — is all an opportunity for me to rise.» — Kobe Bryant',
  takeaway:
    'Newsac дээр Mamba гэдэг нь «илүү хичээ» гэсэн хоосон үг биш. Төлөвлө. Хэмж. Зас. Дахин хий. Өдөр бүр. Энэ л mentality.',
}

export const freeAgents: FreeAgent[] = [
  {
    id: 'nba-fa-26-lebron',
    rank: 1,
    name: 'LeBron James',
    position: 'SF / PF',
    lastTeam: 'Los Angeles Lakers',
    newTeam: 'Philadelphia 76ers',
    age: '41',
    height: '206 см',
    weight: '113 кг',
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&h=800&q=80',
    note: '2 жил / $8 сая · veteran min. «My last decision.»',
    detail: [
      'Карьерын онооны аварга, 4 удаагийн MVP 24 дэх улирал руугаа орж байна. Lakers-ээс салсны дараа тэтгэвэрт гарах хувилбар байсан.',
      'Sixers-т Maxey, Jaylen Brown, Embiid-тэй хамт win-now төсөл. Minutes, load, closing lineup — бүгд асуулттай ч цаасан дээр East-ийн хамгийн чанга нэмэлт.',
    ],
    fit: 'Philadelphia 76ers — Maxey / Brown / Embiid spacing + playmaking',
  },
  {
    id: 'nba-fa-26-reaves',
    rank: 2,
    name: 'Austin Reaves',
    position: 'SG',
    lastTeam: 'Los Angeles Lakers',
    newTeam: 'Los Angeles Lakers',
    age: '28',
    height: '196 см',
    weight: '93 кг',
    image:
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=600&h=800&q=80',
    note: '4 жилийн max · ~$185 сая. Luka-гийн хажууд түгжигдлээ.',
    detail: [
      'Player option-оо тавиад Lakers дээр max гарын үсэг зурав. Brooklyn, Detroit зэрэг багууд max түвшинд явна гэсэн яриа байсан.',
      'On-ball creation, late-clock shot-making, Luka-тай chemistry. L.A.-ийн offseason-ийн #1 priority байсан бөгөөд тэд төлсөн.',
    ],
    fit: 'Lakers — Luka Dončić-ийн secondary creator',
  },
  {
    id: 'nba-fa-26-kessler',
    rank: 3,
    name: 'Walker Kessler',
    position: 'C',
    lastTeam: 'Utah Jazz',
    newTeam: 'Los Angeles Lakers',
    age: '25',
    height: '218 см',
    weight: '111 кг',
    image:
      'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?auto=format&fit=crop&w=600&h=800&q=80',
    note: 'Sign-and-trade · 4 жил / ~$130 сая. Rim + lob.',
    detail: [
      'Jazz-аас Lakers руу sign-and-trade. Modern center: drop coverage, lob threat, вертикаль spacing.',
      'LeBron явсны дараа L.A. size дутагдаж байсан. Kessler + Luka PnR бол 2026–27-ийн гол дайралт байх ёстой.',
    ],
    fit: 'Lakers — pick-and-roll rim protection',
  },
  {
    id: 'nba-fa-26-trae',
    rank: 4,
    name: 'Trae Young',
    position: 'PG',
    lastTeam: 'Washington Wizards',
    newTeam: 'Washington Wizards',
    age: '27',
    height: '185 см',
    weight: '74 кг',
    image:
      'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=600&h=800&q=80',
    note: '4 жил / $213 сая. Wizards түүнийг нүүр царайгаараа үлдээв.',
    detail: [
      'Хагас талбайн pick-and-roll engine. Deep range, live dribble pass. Defense асуулттай хэвээр.',
      'Washington rebuild дундаа max-оор барьсан нь «Young + young core» төслийг үргэлжлүүлнэ гэсэн дохио.',
    ],
    fit: 'Wizards — offense-ийн нэгдүгээр товч',
  },
  {
    id: 'nba-fa-26-hartenstein',
    rank: 5,
    name: 'Isaiah Hartenstein',
    position: 'C',
    lastTeam: 'Oklahoma City Thunder',
    newTeam: 'Oklahoma City Thunder',
    age: '28',
    height: '213 см',
    weight: '113 кг',
    image:
      'https://images.unsplash.com/photo-1608245449230-4ac190afb580?auto=format&fit=crop&w=600&h=800&q=80',
    note: '3 жил / $75 сая. Чемпионы «quiet» big.',
    detail: [
      'Short-roll passing, screen IQ, paint deterrence. Highlight биш — winning basketball.',
      'OKC SGA-тай системээ хадгалж, contender window-оо одоо түгжихийг сонгосон.',
    ],
    fit: 'Thunder — 5-out rim + pass',
  },
  {
    id: 'nba-fa-26-powell',
    rank: 6,
    name: 'Norman Powell',
    position: 'SG',
    lastTeam: 'Miami Heat',
    newTeam: 'Chicago Bulls',
    age: '33',
    height: '193 см',
    weight: '98 кг',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba6851?auto=format&fit=crop&w=600&h=800&q=80',
    note: '2 жил / ~$44 сая. Instant offense.',
    detail: [
      'Catch-and-shoot + isolation scoring. Heat-д playoff shot-making-ээ харуулсан.',
      'Bulls scoring punch нэмэв. Role тодорхой: шид, create, closing minutes-д хөргөхгүй.',
    ],
    fit: 'Bulls — second-side scoring',
  },
  {
    id: 'nba-fa-26-collins',
    rank: 7,
    name: 'John Collins',
    position: 'PF',
    lastTeam: 'Los Angeles Clippers',
    newTeam: 'Detroit Pistons',
    age: '28',
    height: '206 см',
    weight: '103 кг',
    image:
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=600&h=800&q=80',
    note: '3 жил / $51 сая. Athleticism + roll gravity.',
    detail: [
      'Above-the-rim roll man, dunk gravity, зарим оройд stretch. Pistons-ийн young core-той athletic frontcourt.',
      'Detroit rising seed байхад interior finishing болон offensive rebound хэрэгтэй. Collins тэр нүхийг бөглөнө.',
    ],
    fit: 'Pistons — PnR finisher / athletic four',
  },
  {
    id: 'nba-fa-26-robinson',
    rank: 8,
    name: 'Mitchell Robinson',
    position: 'C',
    lastTeam: 'New York Knicks',
    newTeam: 'Boston Celtics',
    age: '28',
    height: '213 см',
    weight: '109 кг',
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&h=800&q=80',
    note: '3 жил / ~$47 сая. Rim + glass. Brown-ийн дараах paint.',
    detail: [
      'Elite offensive rebounder, rim runner, drop coverage. Injury history анхаарах ёстой.',
      'Celtics Jaylen Brown-ийг алдсаны дараа paint болон physicality нэмэх шаардлагатай байсан. Robinson тэр профайл.',
    ],
    fit: 'Celtics — rim protection / offensive glass',
  },
]

export const sacfunBits = [
  {
    id: 'nba-sf-26-court',
    title: 'Sacfun Court',
    text: 'Highlight reaction, bold prediction, hot take — Newsac community нэг court дээр. Долоо хоног бүрийн take-ээ Facebook page дээр үлдээгээрэй.',
  },
  {
    id: 'nba-sf-26-pickem',
    title: 'Pick’em Night',
    text: 'Өнөөдрийн board: хэн ялах вэ, хэн 30+ авна вэ? Найзтайгаа score хөтөл. Ялагч дараагийн Quiz-д нэрээ дурдуул.',
  },
  {
    id: 'nba-sf-26-ub',
    title: 'Mongol take',
    text: 'UB цагаар шөнө дунд тоглолт — coffee + clutch. Хамгийн гоё take-ээ Facebook эсвэл @Newsacsacfun коммент дээр бич.',
  },
  {
    id: 'nba-sf-26-clip',
    title: 'Clip of the week',
    text: 'Долоо хоногийн play-г Sacfun YouTube (@Newsacsacfun) дээр тавина. Доороос шууд үзээрэй.',
  },
]

export const nbaQuiz: QuizQ[] = [
  {
    id: 'nba-q-26-1',
    q: '2026 оны зун LeBron James аль багтай гэрээ байгуулсан бэ?',
    choices: [
      'Los Angeles Lakers',
      'Philadelphia 76ers',
      'Golden State Warriors',
      'Miami Heat',
    ],
    answer: 1,
    explain: 'LeBron Lakers-ээс салж, Sixers-тэй 2 жилийн veteran min гэрээ байгуулсан («my last decision»).',
  },
  {
    id: 'nba-q-26-2',
    q: 'Kobe Bryant бүх карьераа аль багт өнгөрөөсөн бэ?',
    choices: ['Chicago Bulls', 'Los Angeles Lakers', 'Boston Celtics', 'Philadelphia 76ers'],
    answer: 1,
    explain: 'Kobe 20 улирлыг бүгдийг Lakers-т өнгөрөөсөн. 5 аварга, 18 All-Star.',
  },
  {
    id: 'nba-q-26-3',
    q: 'NBA-д shot clock хэдэн секунд вэ?',
    choices: ['18', '20', '24', '30'],
    answer: 2,
    explain: 'NBA shot clock 24 секунд. FIBA ч мөн 24.',
  },
  {
    id: 'nba-q-26-4',
    q: 'Нэг баг талбай дээр нэгэн зэрэг хэдэн тоглогчтой вэ?',
    choices: ['4', '5', '6', '7'],
    answer: 1,
    explain: 'Баг бүр 5, нийт 10 тоглогч талбай дээр.',
  },
  {
    id: 'nba-q-26-5',
    q: 'Regular season-д нэг баг хэдэн тоглолт хийдэг вэ?',
    choices: ['72', '78', '82', '88'],
    answer: 2,
    explain: 'NBA regular season 82 тоглолт (bubble/COVID жилүүдийг эс тооцвол).',
  },
  {
    id: 'nba-q-26-6',
    q: 'Нэг үе хэдэн минут вэ (NBA)?',
    choices: ['8', '10', '12', '15'],
    answer: 2,
    explain: 'NBA-д 4 үе × 12 минут. NCAA 2 × 20, FIBA 4 × 10.',
  },
  {
    id: 'nba-q-26-7',
    q: 'NBA-ийн 3 онооны шугам top of the key орчим хэдэн фут вэ?',
    choices: ['19.75', '22', '23.75', '25'],
    answer: 2,
    explain: 'NBA 3PT шугам нумын оройд 23.75 фут, булан дээр 22 фут.',
  },
  {
    id: 'nba-q-26-8',
    q: 'Finals MVP цом ямар нэртэй вэ?',
    choices: ['Larry O’Brien', 'Bill Russell Trophy', 'Magic Johnson Trophy', 'Naismith Trophy'],
    answer: 1,
    explain: 'Finals MVP = Bill Russell Trophy. Larry O’Brien бол багийн аваргаллын цом.',
  },
  {
    id: 'nba-q-26-9',
    q: 'Austin Reaves 2026 онд ямар гэрээтэй Lakers-т үлдсэн бэ?',
    choices: [
      '1 жилийн veteran min',
      '2 жил / mid-level',
      '4 жилийн maximum (~$185 сая)',
      'Sign-and-trade-ээр Clippers',
    ],
    answer: 2,
    explain: 'Reaves player option-оо тавиад Lakers-тэй 4 жилийн max гэрээ байгуулсан.',
  },
  {
    id: 'nba-q-26-10',
    q: 'Walker Kessler ямар аргаар Lakers-т ирсэн бэ?',
    choices: [
      'Draft',
      'Utah Jazz-тай sign-and-trade',
      'Buyout-оор Heat-ээс',
      'Two-way contract',
    ],
    answer: 1,
    explain: 'Kessler Jazz-тай sign-and-trade-ээр 4 жил / ~$130 саяар Lakers-т ирсэн.',
  },
]
